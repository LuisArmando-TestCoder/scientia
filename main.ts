/// <reference lib="deno.ns" />

/**************************************************************************************************
 * Claim Analysis – Functional & Modular Refactor                                                  *
 * ------------------------------------------------------------------------------------------------ *
 * This refactor converts the original imperative / class‑centric approach into an almost‑pure      *
 * functional style. All state is encapsulated in closures that expose explicit, side‑effect‑free   *
 * interfaces wherever feasible. Business logic remains identical.                                 *
 *                                                                                                 *
 * Clean‑code conventions applied                                                                  *
 * • Top‑level: imports ▸ constants ▸ pure helpers ▸ impure helpers ▸ business functions ▸ main.    *
 * • Verbose, intention‑revealing identifier names.                                                 *
 * • JSDoc for all public helpers and exported symbols.                                            *
 **************************************************************************************************/

// ────────────────────────────────────────────────────────────────────────────────
// Dependencies
// ────────────────────────────────────────────────────────────────────────────────
import { join, resolve as pathResolve, dirname as pathDirname, basename as pathBasename } from "https://deno.land/std@0.224.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { parse as parseFlags } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { getClaimAnalysis } from "./scientia.ts";
import { jsonToMarkdown } from "./jsontomarkdown.ts";
import { generateFolderPrefix, getNextNumericIndex } from "./prefixHelper.ts";

// ────────────────────────────────────────────────────────────────────────────────
// Constants & Regular Expressions
// ────────────────────────────────────────────────────────────────────────────────

/** Matches identifiers composed exclusively of dot‑separated integers. */
const IDENTIFIER_ONLY_REGEXP: RegExp = /^\d+(?:\.\d+)*$/;

// ────────────────────────────────────────────────────────────────────────────────
// Pure Utility Helpers (No I/O)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Determines if a string contains only numeric identifiers (e.g. "1.2.3").
 */
const isIdentifierOnly = (rawText: string): boolean =>
  IDENTIFIER_ONLY_REGEXP.test(rawText.trim());

/**
 * Produces a URL‑safe, filesystem‑friendly slug with a hard limit to prevent OS filename errors.
 * The `maxTotalLength` parameter should account for any prefix or extension added externally.
 */
const slugify = (rawText: string, maxTotalLength: number = 100): string => {
  const base = rawText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return base.slice(0, maxTotalLength);
};

// ────────────────────────────────────────────────────────────────────────────────
// Stateful Queuing (Encapsulated in a Factory for FP‑Friendly API)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Creates a synchronous promise queue that guarantees first‑in‑first‑out *serial* execution.
 */
const createSynchronousTaskQueue = () => {
  let taskQueue: Array<() => Promise<unknown>> = [];
  let isProcessing = false;

  const processQueue = async (): Promise<void> => {
    if (isProcessing || taskQueue.length === 0) return;

    isProcessing = true;
    const nextTask = taskQueue.shift();

    if (nextTask) {
      try {
        await nextTask();
      } catch (processingError) {
        console.error("Error during task execution:", processingError);
      } finally {
        isProcessing = false;
        await processQueue();
      }
    } else {
      isProcessing = false;
    }
  };

  /**
   * Adds a task to the queue and returns a promise that resolves with its result.
   */
  const enqueueTask = <T>(taskFactory: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      taskQueue.push(async () => {
        try {
          const result = await taskFactory();
          resolve(result);
        } catch (taskError) {
          reject(taskError);
        }
      });
      processQueue();
    });

  return { enqueueTask } as const;
};

/**
 * Wraps an async function so that calls are automatically serialized through the provided queue.
 */
function createQueuedExecutor<Args extends unknown[], Result>(
  asyncFunction: (...args: Args) => Promise<Result>,
  queue: ReturnType<typeof createSynchronousTaskQueue>,
) {
  return (...args: Args): Promise<Result> =>
    queue.enqueueTask(() => asyncFunction(...args));
}

function getColapsedArgumentedAnalysis(analysisJson: Record<string, any>) {
  const dictionary = analysisJson.formula_dictionary || analysisJson.diccionario_de_la_formula || {};
  const truthTable = analysisJson.truth_table?.rows || analysisJson.tabla_verdad?.filas || [];
  const reformulation = analysisJson.boolean_argument_reformulation || analysisJson.reformula_booleana_del_argumento || "";

  const definitions = eval(`
    Object.entries(${JSON.stringify(dictionary)}).map(([
      name, value
    ]) => {
      let statementState = ${JSON.stringify(truthTable)}.find(([
        afirmation,
        truthment,
        falsement,
        undefinement
      ]) => {
        console.log(value.trim(), " | value")
        console.log(afirmation.trim(), " | afirmation")
        console.log("-")
        
        return (
          value.trim().includes(afirmation.trim()) ||
          afirmation.trim().includes(value.trim())
          // The AI might not have generated the same statements
        )
      });
      const variableDefinition = statementState ? \`let \${name} = \${statementState[1]} || \${statementState[1] === 0 && statementState[2] === 1 ? 0 : statementState[1] || "Error"}\` : \`let \${name} = undefined;\`
    
      return variableDefinition;
    }).join("\\n")
  `);

  console.log("definitions", definitions)

  let result;
  try {
    result = eval(`
        (function () {
            ${definitions}

            return ${definitions.includes("Error") || definitions.includes("undefined") ? "undefined" : reformulation}
        })()
    `);
  } catch (e) {
    console.error("Failed to evaluate reformulation:", reformulation, e);
    result = "undefined";
  }

  return result;
}

// ────────────────────────────────────────────────────────────────────────────────
// Impure Helpers (Filesystem & Console I/O)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Persists the JSON analysis and its Markdown rendition side‑by‑side.
 */
async function persistClaimArtifacts(
  targetDirectoryPath: string,
  claimPrefixIdentifier: string,
  semanticNodeText: string,
  analysisJson: Record<string, any>,
  analysisContext: string = "",
): Promise<void> {
  await Deno.mkdir(targetDirectoryPath, { recursive: true }); // ensureDir might be better here too

  if (!semanticNodeText || isIdentifierOnly(semanticNodeText)) return; // skip void‑like nodes

  const baseFileNameSafe = `${claimPrefixIdentifier} ${slugify(semanticNodeText)}`;

  const jsonPath = join(targetDirectoryPath, `${baseFileNameSafe}.json`);
  const mdPath = join(targetDirectoryPath, `${baseFileNameSafe}.md`);
  const finalObject = {
    ...analysisJson, context: analysisContext,
    collapsed_boolean_state_by_deterministic_calculation:
      getColapsedArgumentedAnalysis(analysisJson)
  };

  await Deno.writeTextFile(
    jsonPath,
    JSON.stringify(finalObject, null, 2),
  );
  await Deno.writeTextFile(
    mdPath,
    jsonToMarkdown(finalObject),
  );

  console.log(`✅ Saved → ${jsonPath}`);
}

/**
 * Reads every file within *folderPath* (no recursion into directories) and returns their full paths.
 */
export async function listFilesRecursively(folderPath: string): Promise<string[]> {
  const collectedPaths: string[] = [];
  for await (const entry of walk(folderPath, { includeDirs: false })) {
    collectedPaths.push(entry.path);
  }
  return collectedPaths;
}

// ────────────────────────────────────────────────────────────────────────────────
// Business‑Logic Functions (Pure wrappers around impure helpers)
// ────────────────────────────────────────────────────────────────────────────────

const apiCallQueue = createSynchronousTaskQueue();
const queuedGetClaimAnalysis = createQueuedExecutor(getClaimAnalysis, apiCallQueue);

/**
 * Performs a depth‑first traversal of truth‑table rows labelled as *uncertain* (== 1) and
 * recursively analyses them. Maintains *prefix* numbering semantics identical to the legacy code.
 */
// ────────────────────────────────────────────────────────────────────────────────
// Resolution Logger Helper
// ────────────────────────────────────────────────────────────────────────────────

async function appendResolutionLog(outputDirectoryPath: string, text: string): Promise<void> {
  const resolutionPath = join(outputDirectoryPath, "resolution.md");
  const timestamp = new Date().toISOString();
  const logEntry = `\n---\n**[${timestamp}]**\n${text}\n`;
  try {
    await Deno.writeTextFile(resolutionPath, logEntry, { append: true });
  } catch (fsError) {
    if (fsError instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(resolutionPath, `# Resolution Backpropagation Log\n${logEntry}`);
    } else {
      throw fsError;
    }
  }
}

async function analyseClaimRecursively({
  claimText,
  numericPrefix,
  outputDirectoryPath,
  analysisContext = "",
  parentMarkdownBaseName = "",
}: {
  claimText: string;
  numericPrefix: string;
  outputDirectoryPath: string;
  analysisContext?: string;
  parentMarkdownBaseName?: string;
}): Promise<boolean | undefined> {
  console.log(`[${numericPrefix}] claim:`, claimText);

  // Queue‑controlled external API call
  const analysis = await queuedGetClaimAnalysis(claimText) as Record<string, unknown>;

  // Fallback order preserved from legacy code
  const semanticNode: string =
    (analysis as Record<string, string>).input_semantic_node ??
    (analysis as Record<string, string>).central_semantic_node ??
    (analysis as Record<string, string>).nodo_semantico_de_entrada ??
    (analysis as Record<string, string>).nodo_semantico ??
    claimText;

  const currentMarkdownBaseName = `${numericPrefix} ${slugify(semanticNode)}`;

  // Append a link to the newly created note into its parent (if any)
  if (parentMarkdownBaseName) {
    const parentMarkdownPath = join(outputDirectoryPath, `${parentMarkdownBaseName}.md`);
    try {
      await Deno.writeTextFile(parentMarkdownPath, `\n[[${currentMarkdownBaseName}]]\n`, {
        append: true,
      });
    } catch (fsError) {
      if (fsError instanceof Deno.errors.NotFound) {
        console.warn(`⏩ Parent file not found: ${parentMarkdownPath}`);
      } else {
        throw fsError;
      }
    }
  }

  await persistClaimArtifacts(
    outputDirectoryPath,
    numericPrefix,
    semanticNode,
    analysis,
    claimText,
  );

  // Drill down into *uncertain* sub‑claims
  const filas = analysis.truth_table?.rows || analysis.tabla_verdad?.filas;
  let childCounter = 1;
  const childTasks: Array<{
    rowIndex: number;
    subClaim: string;
    promise: Promise<boolean | undefined>;
  }> = [];

  const initialParentState = getColapsedArgumentedAnalysis(analysis);

  for (let i = 0; i < filas.length; i++) {
    const row = filas[i];
    const subClaim = row[0];
    const truth = row[1];
    const contradiction = row[2];
    const uncertainty = row[3];

    const truthLabel = truth
      ? "true"
      : contradiction
        ? "false"
        : uncertainty === 1
          ? "uncertain"
          : "self‑referential";

    console.log(`[${numericPrefix}.${childCounter}] sub‑claim:`, subClaim, `(${truthLabel})`);

    const nextPrefix = `${numericPrefix}.${childCounter}`;
    childCounter++;

    if (uncertainty === 1 && !isIdentifierOnly(subClaim) && initialParentState === undefined) {
      childTasks.push({
        rowIndex: i,
        subClaim,
        promise: analyseClaimRecursively({
          claimText: `${subClaim} (context: ${analysisContext || claimText})`,
          numericPrefix: nextPrefix,
          outputDirectoryPath,
          analysisContext: analysisContext || claimText,
          parentMarkdownBaseName: currentMarkdownBaseName,
        })
      });
    }
  }

  // If no child tasks or already collapsed deterministically, return the state directly
  if (childTasks.length === 0) {
    return initialParentState;
  }

  // Ensure deterministic order and collect resolved states
  const resolvedStates: Record<number, boolean | undefined> = {};
  for (const task of childTasks) {
    resolvedStates[task.rowIndex] = await task.promise;
  }

  // Construct in-memory updated truth table
  const updatedAnalysis = JSON.parse(JSON.stringify(analysis)); // Deep clone
  const updatedFilas = updatedAnalysis.truth_table?.rows || updatedAnalysis.tabla_verdad?.filas;

  let childResolutionLog = `### Backpropagation for [${numericPrefix}] ${semanticNode}\n\n`;
  childResolutionLog += `**Parent Claim:** ${claimText}\n\n`;
  childResolutionLog += `**Child Resolutions:**\n`;

  for (const task of childTasks) {
    const resolvedState = resolvedStates[task.rowIndex];
    childResolutionLog += `- Sub-claim: "${task.subClaim}" resolved to **${resolvedState}**\n`;

    if (resolvedState === true) {
      updatedFilas[task.rowIndex][1] = 1; // verdad
      updatedFilas[task.rowIndex][2] = 0; // falso
      updatedFilas[task.rowIndex][3] = 0; // indefinido
    } else if (resolvedState === false) {
      updatedFilas[task.rowIndex][1] = 0; // verdad
      updatedFilas[task.rowIndex][2] = 1; // falso
      updatedFilas[task.rowIndex][3] = 0; // indefinido
    }
    // If it's still undefined, we leave it as is
  }

  // Recalculate parent state with the updated in-memory table
  const finalParentState = getColapsedArgumentedAnalysis(updatedAnalysis);
  
  childResolutionLog += `\n**Final Evaluated State for [${numericPrefix}]:** **${finalParentState}**\n`;

  // Log the bubbling resolution
  await appendResolutionLog(outputDirectoryPath, childResolutionLog);

  return finalParentState;
}

// ────────────────────────────────────────────────────────────────────────────────
// Startup Helpers & Argument Parsing
// ────────────────────────────────────────────────────────────────────────────────

/** Ensures the shared "proposiciones" directory exists before any operation. */
async function ensurePropositionsRoot(): Promise<void> {
  try {
    await Deno.stat("proposiciones");
    console.log("'proposiciones' directory already exists.");
  } catch (statError) {
    if (statError instanceof Deno.errors.NotFound) {
      console.log("'proposiciones' directory not found. Creating it...");
      await Deno.mkdir("proposiciones", { recursive: true });
      console.log("'proposiciones' directory created.");
    } else {
      throw statError;
    }
  }
}

/** Parses CLI arguments and separates *resume* mode from new‑analysis mode. */
function parseCommandLine(): {
  resumeFolderName: string;
  rootClaimText: string;
  testClaim: string;
  outputDir?: string;
} {
  const flags = parseFlags(Deno.args, {
    string: ["output-dir"],
    alias: { "output-dir": "o" },
  });

  const positionalArgs = flags._ as string[];

  if (positionalArgs.length === 0 && !flags["output-dir"] && !Deno.args.includes("resume") && !Deno.args.includes("test")) {
     // Allow running with only --output-dir if it's a special mode, otherwise require claim.
     // This check might need refinement based on how --output-dir is intended to be used alone.
    console.error("Please provide a claim to analyse or specify 'resume' or 'test' mode.");
    Deno.exit(1);
  }
  
  const outputDir = flags["output-dir"];
  let rootClaimText = "";
  let resumeFolderName = "";
  let testClaim = "";

  if (positionalArgs[0] === "resume") {
    resumeFolderName = positionalArgs.slice(1).join(" ");
  } else if (positionalArgs[0] === "test" && positionalArgs.length > 1) {
    testClaim = positionalArgs[1];
  } else if (positionalArgs.length > 0) {
    rootClaimText = positionalArgs.join(" ");
  } else if (!outputDir && rootClaimText === "") { 
    console.error("Invalid arguments. Please provide a claim, or use 'resume' or 'test' mode, or specify an output directory if no claim is given for a new analysis.");
    Deno.exit(1);
  }

  return { resumeFolderName, rootClaimText, testClaim, outputDir };
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Execution Pipeline
// ────────────────────────────────────────────────────────────────────────────────

async function runPipeline() {
  console.log("Starting claim analysis…");
  await ensurePropositionsRoot(); // Ensures 'proposiciones' exists for default cases

  const { resumeFolderName, rootClaimText, testClaim, outputDir } = parseCommandLine();

  if (testClaim) {
    const jsonFilePath = testClaim;
    const analysisData = JSON.parse(Deno.readTextFileSync(jsonFilePath));

    console.log("getColapsedArgumentedAnalysis",
      analysisData.boolean_argument_reformulation || analysisData.reformula_booleana_del_argumento,
      analysisData.collapsed_boolean_state_by_deterministic_calculation || analysisData.estado_booleano_colapsado_por_calculo_determinista,
      getColapsedArgumentedAnalysis(
        analysisData
      )
    );
    return;
  }

  let isNewClaim = !resumeFolderName;
  let currentResumeFolder = resumeFolderName;

  if (isNewClaim) {
    // ──────────────────────────────────────────────────────────────────
    // NEW CLAIM MODE
    // ──────────────────────────────────────────────────────────────────
    let rootDirectoryPath: string;
    const claimSlug = slugify(rootClaimText) || "claim_analysis"; // Default slug if rootClaimText is empty

    if (outputDir && outputDir.trim() !== "" && outputDir.trim() !== "./proposiciones" && outputDir.trim() !== "proposiciones") {
      const absoluteOutputDir = pathResolve(outputDir);
      await ensureDir(absoluteOutputDir); 

      const numericIndex = await getNextNumericIndex(absoluteOutputDir);
      const prefix = await generateFolderPrefix(numericIndex, absoluteOutputDir, true); 
      
      const finalFolderName = `${prefix}${claimSlug}`;
      rootDirectoryPath = join(absoluteOutputDir, finalFolderName);
      console.log(`Outputting to custom prefixed directory: ${rootDirectoryPath}`);
    } else {
      rootDirectoryPath = join("proposiciones", claimSlug);
      console.log(`Outputting to default directory: ${rootDirectoryPath}`);
    }
    
    await ensureDir(rootDirectoryPath); 

    const rerunShellPath = join(rootDirectoryPath, "claim.sh");
    const rerunShellContent =
      `deno run -A main.ts \"${rootClaimText.replace(/"/g, '\\"')}\"` + 
      (outputDir ? ` -o "${outputDir.replace(/"/g, '\\"')}"` : "") + 
      "\n";
    await Deno.writeTextFile(rerunShellPath, rerunShellContent);

    currentResumeFolder = rootDirectoryPath.split('/').pop()!;
    
    // Kick off the root claim once
    const rootJsonPrefixSearchString = `0 `;
    const existingInitialFiles = await listFilesRecursively(rootDirectoryPath).catch(() => []);
    const alreadyStarted = existingInitialFiles.some(f => pathBasename(f).startsWith(rootJsonPrefixSearchString) && f.endsWith(".json"));

    if (!alreadyStarted) {
      try {
        await analyseClaimRecursively({
          claimText: rootClaimText,
          numericPrefix: "0", 
          outputDirectoryPath: rootDirectoryPath,
        });
      } catch (e) {
        console.error("Crash during initial root analysis:", e);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────
  // AUTO-RESUME LOOP
  // ──────────────────────────────────────────────────────────────────
  while (true) {
    try {
      const resumeDirPath = `proposiciones/${currentResumeFolder}`;
      const existingFiles = await listFilesRecursively(resumeDirPath);
      
      let workDone = false;

      for (const filePath of existingFiles) {
        if (!filePath.endsWith(".json")) continue;

        const analysisData = JSON.parse(Deno.readTextFileSync(filePath));
        const parentPrefix = filePath.split("/").at(-1)!.split(" ")[0];
        const filas = analysisData.truth_table?.rows || analysisData.tabla_verdad?.filas;

        if (!filas) continue;

        const partialRows = filas
          .map((row: unknown[], idx: number) => [...row, idx + 1])
          .filter((row: any) => row[3] === 1); // uncertainty === 1

        for (const row of partialRows) {
          const statement = row[0];
          const rowIndex = row[5];
          const childPrefix = `${parentPrefix}.${rowIndex}`;
          
          const alreadyExists = existingFiles.some((fp) => pathBasename(fp).startsWith(`${childPrefix} `) && fp.endsWith(".json"));
          if (alreadyExists) continue;

          const parentMarkdownPath = existingFiles.find((fp) => pathBasename(fp).startsWith(`${parentPrefix} `) && fp.endsWith(".md"));
          const parentMarkdownBaseName = parentMarkdownPath ? pathBasename(parentMarkdownPath).replace(/\.md$/, "") : undefined;

          workDone = true;
          console.log("Auto-resuming partial statement:", childPrefix);
          await analyseClaimRecursively({
            claimText: statement,
            numericPrefix: childPrefix,
            outputDirectoryPath: resumeDirPath,
            analysisContext: analysisData.context || analysisData.contexto,
            parentMarkdownBaseName,
          });
        }
      }

      if (!workDone) {
        console.log("Claim analysis completed fully.");
        break;
      }
    } catch (e) {
      console.error("Crash encountered during execution:", e);
      console.log("Auto-resuming in 10 seconds...");
      await new Promise(r => setTimeout(r, 10000));
    }
  }
}

await runPipeline();
