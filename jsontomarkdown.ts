/// <reference lib="deno.ns" />

// ────────────────────────────────────────────────────────────────────────────────
// Dependencies
// ────────────────────────────────────────────────────────────────────────────────
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { getClaimAnalysis } from "./scientia.ts";
import { jsonToMarkdown } from "./jsontomarkdown.ts";

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
 * Produces a URL‑safe, filesystem‑friendly slug that does **not** leak accents.
 */
const slugify = (rawText: string): string =>
  rawText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60)
    .replace(/^_|_$/g, "");

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
  analysisJson: Record<string, unknown>,
  analysisContext: string = "",
): Promise<void> {
  await Deno.mkdir(targetDirectoryPath, { recursive: true });

  if (!semanticNodeText || isIdentifierOnly(semanticNodeText)) return; // skip void‑like nodes

  const baseFileNameSafe = `${claimPrefixIdentifier} ${slugify(semanticNodeText)}`;

  const jsonPath = join(targetDirectoryPath, `${baseFileNameSafe}.json`);
  const mdPath = join(targetDirectoryPath, `${baseFileNameSafe}.md`);

  await Deno.writeTextFile(
    jsonPath,
    JSON.stringify({ ...analysisJson, contexto: analysisContext }, null, 2),
  );
  await Deno.writeTextFile(
    mdPath,
    jsonToMarkdown({ ...analysisJson, contexto: analysisContext }),
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
}): Promise<void> {
  console.log(`[${numericPrefix}] claim:`, claimText);

  // Queue‑controlled external API call
  const analysis = await queuedGetClaimAnalysis(claimText) as Record<string, unknown>;

  // Fallback order preserved from legacy code
  const semanticNode: string =
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
  const { filas } = (analysis as any).tabla_verdad;
  let childCounter = 1;
  const childTasks: Array<Promise<void>> = [];

  for (const [subClaim, truth, contradiction, uncertainty] of filas) {
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

    if (uncertainty === 1 && !isIdentifierOnly(subClaim)) {
      childTasks.push(
        analyseClaimRecursively({
          claimText: `${subClaim} (contexto: ${analysisContext || claimText})`,
          numericPrefix: nextPrefix,
          outputDirectoryPath,
          analysisContext: analysisContext || claimText,
          parentMarkdownBaseName: currentMarkdownBaseName,
        }),
      );
    }
  }

  // Ensure deterministic order
  for (const task of childTasks) await task;
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
function parseCommandLine(): { resumeFolderName: string; rootClaimText: string } {
  const rawArgs = [...Deno.args];
  if (rawArgs.length === 0) {
    console.error("Please provide a claim to analyse.");
    Deno.exit(1);
  }
  const resumeFolderName = rawArgs[0] === "resume" ? rawArgs.slice(1).join(" ") : "";
  const rootClaimText = rawArgs.join(" ");
  return { resumeFolderName, rootClaimText };
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Execution Pipeline
// ────────────────────────────────────────────────────────────────────────────────

console.log("Starting claim analysis…");
await ensurePropositionsRoot();

const { resumeFolderName, rootClaimText } = parseCommandLine();

if (resumeFolderName) {
  // ──────────────────────────────────────────────────────────────────
  // RESUME MODE
  // ──────────────────────────────────────────────────────────────────
  const resumeDirPath = `proposiciones/${resumeFolderName}`;
  const existingFiles = await listFilesRecursively(resumeDirPath);

  for (const filePath of existingFiles) {
    if (!filePath.endsWith(".json")) continue;

    const analysisData = JSON.parse(Deno.readTextFileSync(filePath));
    const parentPrefix = filePath.split("/").at(-1)!.split(" ")[0];
    const { filas } = analysisData.tabla_verdad;

    const partialRows = filas
      .map((row: unknown[], idx: number) => [...row, idx + 1])
      .filter(([, , , uncertainty]) => uncertainty === 1);

    console.log("Partial statements to resume:", partialRows);

    for (const [statement, , , , rowIndex] of partialRows) {
      const childPrefix = `${parentPrefix}.${rowIndex}`;
      const parentMarkdownPath = existingFiles.find((fp) => fp.includes(`${parentPrefix} `));
      const parentMarkdownBaseName = parentMarkdownPath?.split("/").pop()?.replace(/\.md$/, "");

      const alreadyExists = existingFiles.some((fp) => fp.includes(`${childPrefix} `));
      if (alreadyExists) continue;

      console.log("resuming", childPrefix);
      await analyseClaimRecursively({
        claimText: statement,
        numericPrefix: childPrefix,
        outputDirectoryPath: resumeDirPath,
        analysisContext: analysisData.contexto,
        parentMarkdownBaseName,
      });
    }
  }
} else {
  // ──────────────────────────────────────────────────────────────────
  // NEW CLAIM MODE
  // ──────────────────────────────────────────────────────────────────
  const rootDirectoryPath = `proposiciones/${slugify(rootClaimText) || "root_claim"}`;
  await Deno.mkdir(rootDirectoryPath, { recursive: true });

  // Bootstrap utility shell script for quick reruns (legacy behaviour)
  const rerunShellPath = join(rootDirectoryPath, "claim.sh");
  const rerunShellContent =
    `deno run --allow-read --allow-env --allow-write --allow-net main.ts \"${rootClaimText}\"` +
    "\n";
  await Deno.writeTextFile(rerunShellPath, rerunShellContent);

  await analyseClaimRecursively({
    claimText: rootClaimText,
    numericPrefix: "0",
    outputDirectoryPath: rootDirectoryPath,
  });
}

console.log("Claim analysis completed.");
