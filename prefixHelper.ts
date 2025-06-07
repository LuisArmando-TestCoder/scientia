// Regex to match the full new numeric prefix and capture parts.
// Group 1: The 19-digit numeric prefix + underscore (e.g., "0000000000000000000_")
// Group 2: The timestamp + underscore (e.g., "SS-MM-HH-DD-MM-YYYY_")
// Group 3: The original folder name.
export const FOLDER_PREFIX_REGEX = /^(\d{19}_)(\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{4}_)(.+)/;

// Regex to test if a name starts with the numeric-timestamp prefix structure.
// Used by getNextNumericIndex and sortFoldersByBirthdate.ts for quick checks.
export const STARTS_WITH_NUMERIC_TIMESTAMP_PREFIX_REGEX = /^\d{19}_\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{4}_/;

const NUMERIC_PREFIX_LENGTH = 19;

function formatNumericIndex(index: number): string {
  return index.toString().padStart(NUMERIC_PREFIX_LENGTH, '0');
}

function formatDateForPrefix(date: Date): string {
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${seconds}-${minutes}-${hours}-${day}-${month}-${year}`;
}

/**
 * Generates a folder prefix string based on a numeric index and the folder's birthtime (or current time).
 * Format: [PaddedNumericIndex]_[SS-MM-HH-DD-MM-YYYY]_
 * Returns the prefix string.
 */
export async function generateFolderPrefix(
  currentIndex: number,
  folderPathForStat: string, // Path used for Deno.stat() if not a new folder
  isNewFolder: boolean = false,
): Promise<string> {
  let birthtime: Date | null = null;

  if (!isNewFolder) {
    try {
      const fileInfo = await Deno.stat(folderPathForStat);
      birthtime = fileInfo.birthtime;
    } catch (err) {
      console.warn(`Could not get stat for ${folderPathForStat}: ${err.message}. Will use current date for prefix part.`);
    }
  }

  const dateToUse = birthtime || new Date();
  if (!birthtime && !isNewFolder) {
      console.warn(`Birthtime not available for: ${folderPathForStat}. Using current date for prefix part.`);
  } else if (isNewFolder) {
      console.log(`Generating prefix for a new folder. Using current date for prefix part.`);
  }
  
  const numericPrefix = formatNumericIndex(currentIndex);
  const dateStr = formatDateForPrefix(dateToUse);
  return `${numericPrefix}_${dateStr}_`;
}

/**
 * Scans a directory to find the next available numeric index for prefixing.
 * It parses the numeric part of existing prefixes to find the highest one.
 * @param parentDir The directory to scan.
 * @returns The next 0-based numeric index to use.
 */
export async function getNextNumericIndex(parentDir: string): Promise<number> {
  let maxIndex = -1;
  try {
    for await (const dirEntry of Deno.readDir(parentDir)) {
      if (dirEntry.isDirectory && STARTS_WITH_NUMERIC_TIMESTAMP_PREFIX_REGEX.test(dirEntry.name)) {
        const numericPart = dirEntry.name.substring(0, NUMERIC_PREFIX_LENGTH);
        const currentIndex = parseInt(numericPart, 10);
        if (!isNaN(currentIndex) && currentIndex > maxIndex) {
          maxIndex = currentIndex;
        }
      }
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return 0; // Parent directory doesn't exist, start from 0.
    }
    console.error(`Error reading directory ${parentDir} to determine next numeric index:`, error.message);
    return 0; // Fallback on other errors.
  }
  return maxIndex + 1; // Next index is one greater than the highest found.
}
