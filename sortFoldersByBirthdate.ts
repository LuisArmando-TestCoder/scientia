import { walk, WalkEntry } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { resolve, dirname, basename, join, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { generateFolderPrefix, FOLDER_PREFIX_REGEX, STARTS_WITH_NUMERIC_TIMESTAMP_PREFIX_REGEX, getNextNumericIndex } from "./prefixHelper.ts"; // Import necessary items

interface FolderRenameOperation {
  originalPath: string;
  newPath: string;
  depth: number;
}

// Use the imported regex
// const fullPrefixRegex = FOLDER_PREFIX_REGEX; // This is an alias, direct usage is fine.

async function main() {
  const { _: positional, folder, "dry-run": dryRun, "remove-prefix": removePrefix } = parse(Deno.args, {
    string: ["folder"],
    boolean: ["dry-run", "remove-prefix"],
    default: { folder: "." },
  });

  const scriptDir = dirname(fromFileUrl(import.meta.url));
  const targetRel = String(folder ?? positional[0] ?? ".");
  const baseFolder = resolve(scriptDir, targetRel);

  console.log(`Scanning folder: ${baseFolder}`);
  if (dryRun) {
    console.log("DRY RUN: No changes will be made.");
  }

  const operations: FolderRenameOperation[] = [];
  // For sortFoldersByBirthdate, when adding prefixes, we determine the index for each folder individually
  // based on its parent, rather than a single sequential counter for the whole run.
  // However, generateFolderPrefix still needs an index.
  // If we want sortFoldersByBirthdate to assign new sequential numbers across *all* folders it processes in one run,
  // this 'numericIndex' would be used. But the current prefixHelper.getNextNumericIndex is per-directory.
  // For now, let's assume sortFoldersByBirthdate will re-calculate the next index for *each* folder's parent dir if adding.
  // This means the `letterIndex` or `numericIndex` here is not used in the same way as in main.ts.
  // The `generateFolderPrefix` in this script will get its index by calling `getNextNumericIndex` for the folder's parent.
  let numericIndex = 0; // Initialize, will be set properly if adding prefixes.
  if (!removePrefix) {
    numericIndex = await getNextNumericIndex(baseFolder); // Get starting index for the whole run
  }

  for await (const entry of walk(baseFolder, { includeDirs: true, includeFiles: false, followSymlinks: false })) {
    if (!entry.isDirectory) {
      continue;
    }

    // Skip the base folder itself from being renamed by this script's logic directly
    // if it's the top-level item.
    if (resolve(entry.path) === baseFolder) {
        console.log(`Skipping base folder: ${entry.path}`);
        continue;
    }

    const dirName = basename(entry.path);

    // Skip hidden folders (e.g., .obsidian)
    if (dirName.startsWith('.')) {
      console.log(`Skipping hidden folder: ${entry.path}`);
      continue;
    }
    
    if (removePrefix) {
      const match = dirName.match(FOLDER_PREFIX_REGEX); // Use imported regex
      if (match && match[3]) { // CORRECTED: match[3] is the original folder name
        const originalName = match[3];
        const parentDir = dirname(entry.path);
        const newPath = join(parentDir, originalName);
        const depth = entry.path.split(Deno.build.os === "windows" ? "\\" : "/").length;
        
        operations.push({
          originalPath: entry.path,
          newPath: newPath,
          depth: depth,
        });
      } else {
        // Not a prefixed folder, or malformed prefix, skip in remove mode
        // console.log(`Skipping non-prefixed folder in remove mode: ${entry.path}`);
      }
    } else { // Add prefix logic (original logic)
      // Test if the dirName *starts with* a prefix pattern.
      // FOLDER_PREFIX_REGEX is designed to capture parts, so for a simple test,
      // we ensure it matches from the start and would have content after the prefix.
      // A simpler regex could be STARTS_WITH_PREFIX_REGEX from prefixHelper if it were exported,
      // or we can adapt its usage here. For now, testing if FOLDER_PREFIX_REGEX matches is sufficient
      // as it implies the prefix structure is present.
      if (STARTS_WITH_NUMERIC_TIMESTAMP_PREFIX_REGEX.test(dirName)) { // Use the more specific test regex
        console.log(`Skipping already prefixed folder: ${entry.path}`);
        continue;
      }

      try {
        // When sortFoldersByBirthdate adds prefixes, use the sequential numericIndex for the current run.
        const prefix = await generateFolderPrefix(numericIndex, entry.path, false); // isNewFolder is false here

        if (prefix) {
          const newDirName = `${prefix}${dirName}`;
          const parentDirOfEntry = dirname(entry.path); // Still need parentDir for join
          const newPath = join(parentDirOfEntry, newDirName);
          numericIndex++; // Increment the run-wide counter
          const depth = entry.path.split(Deno.build.os === "windows" ? "\\" : "/").length;
        
        operations.push({
          originalPath: entry.path,
          newPath: newPath,
          depth: depth,
        });
      }
      // If prefix is null, generateFolderPrefix already logged the reason
    } catch (err) {
      // This catch might be redundant if generateFolderPrefix handles all its errors,
      // but kept for safety for now, or if generateFolderPrefix could throw other errors.
      console.error(`Unexpected error processing ${entry.path}:`, err.message);
    }
  } // This was missing the closing brace for the main else block
}
  // Sort operations by depth (deepest first) to avoid path conflicts
  operations.sort((a, b) => b.depth - a.depth);

  if (operations.length === 0) {
    console.log("No folders to rename.");
    return;
  }

  console.log("\nPlanned renames (deepest first):");
  for (const op of operations) {
    console.log(`  ${op.originalPath} -> ${op.newPath}`);
  }

  if (!dryRun) {
    console.log("\nPerforming renames...");
    let successCount = 0;
    let errorCount = 0;
    for (const op of operations) {
      try {
        await Deno.rename(op.originalPath, op.newPath);
        console.log(`Renamed: ${op.originalPath} -> ${op.newPath}`);
        successCount++;
      } catch (err) {
        console.error(`Error renaming ${op.originalPath} to ${op.newPath}:`, err.message);
        errorCount++;
      }
    }
    console.log(`\nRenaming complete. ${successCount} succeeded, ${errorCount} failed.`);
  } else {
    console.log("\nDry run complete. No actual renames performed.");
  }
}

if (import.meta.main) {
  await main().catch((err) => {
    console.error("Unhandled error in main:", err);
    Deno.exit(1);
  });
}
