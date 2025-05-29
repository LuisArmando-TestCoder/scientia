import { walk, WalkEntry } from "https://deno.land/std@0.192.0/fs/walk.ts";

async function main() {
  const baseFolder = Deno.args[0] || ".";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeBaseName = baseFolder.replace(/[:/\\]/g, "_");
  const outputFilename = `.output${timestamp}_${safeBaseName}.txt`;
  
  // File extensions whitelist - only process .ts files for backend
  const allowedExtensions = [".md"];
  
  let ignorePatterns: string[] = [];
  try {
    const gitignoreContent = await Deno.readTextFile(
      `${baseFolder}/.gitignore`
    );
    const lines = gitignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"));

    ignorePatterns = lines;

    console.log("Loaded patterns from .gitignore:");
    console.log(lines);
  } catch (error) {
    console.warn(
      "No .gitignore found or unable to read it. Proceeding without ignore patterns."
    );
  }

  function shouldSkip(entry: WalkEntry): boolean {
    // Skip if not a whitelisted file extension
    if (entry.isFile) {
      const hasAllowedExtension = allowedExtensions.some(ext => 
        entry.name.toLowerCase().endsWith(ext)
      );
      
      if (!hasAllowedExtension) {
        return true;
      }
    }
    
    // Skip if it's a hidden file or directory
    if (entry.name.startsWith(".") || entry.path.startsWith(".")) {
      return true;
    }

    // Skip if it matches gitignore patterns
    for (const pattern of ignorePatterns) {
      if (entry.name.includes(pattern) || entry.path.includes(pattern)) {
        return true;
      }
    }

    return false;
  }

  // Extract function and class information
  function extractCodeInfo(content: string, filePath: string): string {
    let processedContent = content;
    
    // Add file path as a comment at the top
    processedContent = `// FILE: ${filePath}\n${processedContent}`;
    
    // Extract function signatures
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)[^{]*{/g;
    let match;
    let functionSignatures = "";
    
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];
      functionSignatures += `// FUNCTION: ${functionName}\n`;
    }
    
    // Extract class definitions
    const classRegex = /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+\w+(?:,\s*\w+)*)?\s*{/g;
    let classSignatures = "";
    
    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      classSignatures += `// CLASS: ${className}\n`;
    }
    
    // Extract interface definitions
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+\w+(?:,\s*\w+)*)?\s*{/g;
    let interfaceSignatures = "";
    
    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceName = match[1];
      interfaceSignatures += `// INTERFACE: ${interfaceName}\n`;
    }
    
    // Add summary at the top
    if (functionSignatures || classSignatures || interfaceSignatures) {
      processedContent = `${functionSignatures}${classSignatures}${interfaceSignatures}\n${processedContent}`;
    }
    
    return processedContent;
  }

  console.log(`Scanning folder (relative): ${baseFolder}`);
  console.log(`Only processing files with extensions: ${allowedExtensions.join(", ")}`);

  let combinedOutput = "";
  let fileCount = 0;

  for await (const entry of walk(baseFolder)) {
    if (!entry.isFile || shouldSkip(entry)) {
      continue;
    }

    try {
      const fileContent = await Deno.readTextFile(entry.path);
      const processedContent = extractCodeInfo(fileContent, entry.path);
      
      combinedOutput += `${processedContent}\n\n`;
      console.log(`Processed: ${entry.path}`);
      fileCount++;
    } catch (error) {
      console.error(`Error reading file ${entry.path}: ${error}`);
    }
  }

  if (fileCount === 0) {
    console.warn(
      "No valid files were found or processed. Please check your folder or .gitignore patterns."
    );
  } else {
    console.log(`Total files processed: ${fileCount}`);
  }

  await Deno.writeTextFile(outputFilename, combinedOutput, { append: false });
  console.log(`Output saved to: ${outputFilename}`);
}

main();