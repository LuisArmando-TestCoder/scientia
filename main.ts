/// <reference lib='deno.ns' />

// ———————————————————————————————————————————————————————————————
//  Dependencies
// ———————————————————————————————————————————————————————————————
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { getClaimAnalysis } from './scientia.ts';
import { jsonToMarkdown } from './jsontomarkdown.ts';

// ———————————————————————————————————————————————————————————————
//  Synchronous task queue
// ———————————————————————————————————————————————————————————————
class SynchronousTaskQueue {
  private queue: (() => Promise<unknown>)[] = [];
  private isRunning = false;

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isRunning || this.queue.length === 0) return;
    this.isRunning = true;
    const taskWrapper = this.queue.shift();
    if (taskWrapper) {
      try {
        await taskWrapper();
      } catch (e) {
        console.error('Error during task execution in queue:', e);
      } finally {
        this.isRunning = false;
        this.processQueue();
      }
    } else {
      this.isRunning = false;
    }
  }
}

// ———————————————————————————————————————————————————————————————
//  Utilities
// ———————————————————————————————————————————————————————————————
const ENUM_ONLY_REGEX = /^\d+(?:\.\d+)*$/;

function isIdentifierOnly(text: string): boolean {
  return ENUM_ONLY_REGEX.test(text.trim());
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 60)
    .replace(/^_|_$/g, '');
}

async function persistClaimJSON(
  baseDir: string,
  prefix: string,
  semanticNode: string,
  json: Record<string, unknown>,
  contexto: string = '',
) {
  await Deno.mkdir(baseDir, { recursive: true });
  if (!semanticNode || isIdentifierOnly(semanticNode)) return;

  const fileName = `${prefix} ${slugify(semanticNode)}.json`;
  const filePath = join(baseDir, fileName);
  await Deno.writeTextFile(filePath, JSON.stringify({ ...json, contexto }, null, 2));
  
  const mdfileName = `${prefix} ${slugify(semanticNode)}.md`;
  const mdfilePath = join(baseDir, mdfileName);
  await Deno.writeTextFile(mdfilePath, jsonToMarkdown({ ...json, contexto }));

  console.log(`✅ Guardado → ${filePath}`);
}

function createQueuedExecutor<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  queue: SynchronousTaskQueue,
) {
  return (...args: A): Promise<R> => queue.add(() => fn(...args));
}

// ———————————————————————————————————————————————————————————————
//  Queue-wrapped API call
// ———————————————————————————————————————————————————————————————
const apiCallQueue = new SynchronousTaskQueue();
const queuedGetClaimAnalysis = createQueuedExecutor(
  getClaimAnalysis,
  apiCallQueue,
);

// ———————————————————————————————————————————————————————————————
//  Main
// ———————————————————————————————————————————————————————————————
console.log('Starting claim analysis...');

// Ensure 'proposiciones' directory exists
try {
  await Deno.stat('proposiciones');
  // If stat doesn't throw, directory exists.
  console.log("'proposiciones' directory already exists.");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    // Directory does not exist, create it.
    console.log("'proposiciones' directory not found. Creating it...");
    await Deno.mkdir('proposiciones', { recursive: true });
    console.log("'proposiciones' directory created.");
  } else {
    // Other error, rethrow it.
    console.error("Error checking for 'proposiciones' directory:", error);
    throw error;
  }
}

const args = Deno.args;
if (args.length === 0) {
  console.error('Please provide a claim to analyze.');
  Deno.exit(1);
}

let folder = args[0] === "resume" ? args.slice(1).join(" ") : "";
const claimRoot = args.join(" ");
const rootDirName = `proposiciones/${slugify(claimRoot) || 'root_claim'}`;

async function recursiveClaimAnalysis(
  claim: string,
  prefix: string,
  baseDir: string,
  context = ""
): Promise<void> {
  console.log(`[${prefix}] claim:`, claim);
  const analysis = await queuedGetClaimAnalysis(claim);

  const semanticNode =
    (analysis as Record<string, string>).nodo_semantico_de_entrada ??
    (analysis as Record<string, string>).nodo_semantico ??
    claim;

  await persistClaimJSON(baseDir, prefix, semanticNode, analysis, claim);

  const subtasks: Promise<void>[] = [];
  let childIndex = 1;

  for (
    const [subClaim, truth, contradiction, uncertainty] of
    (analysis as any).tabla_verdad.filas
  ) {
    const label = truth
      ? 'true'
      : contradiction
        ? 'false'
        : uncertainty === 1
          ? 'uncertain'
          : 'self-referential';

    console.log(`[${prefix}.${childIndex}] sub claim:`, subClaim, `(${label})`);

    const nextPrefix = `${prefix}.${childIndex}`;
    childIndex++;

    if (uncertainty === 1 && !isIdentifierOnly(subClaim)) {
      subtasks.push(recursiveClaimAnalysis(`${subClaim} (contexto: ${context || claim})`, nextPrefix, baseDir));
    }
  }

  for (const task of subtasks) await task;
}

export async function getWalkedParamFolder(folderPath: string): Promise<string[]> {
  const files: string[] = [];

  for await (const entry of walk(folderPath, { includeDirs: false })) {
    files.push(entry.path);
  }

  return files;
}

if (folder) {
  const folderPath = `proposiciones/${folder}`;

  const walkedParamFolder = await getWalkedParamFolder(folderPath);
  // see in the already created folder tree the first file using walk tree

  for (const filePath of walkedParamFolder) {
    // get file json content
    if (!filePath.endsWith('.json')) continue;
  
    const analysisObject = JSON.parse(Deno.readTextFileSync(filePath));
    const parentIndex = filePath.split("/").slice(-1)[0].split(" ")[0];
  
    const { filas } = analysisObject.tabla_verdad;
  
    const partialStatements = filas
      .map((fila, index) => ([...fila, index + 1]))
      .filter(([_0, _1, _2, isPartial]) => isPartial === 1);
  
    console.log("Partial statements to resume: ", partialStatements);
  
    for (const [statement, _1, _2, _3, index] of partialStatements) {
      const childIndex = `${parentIndex}.${index}`;
      const alreadyExists = walkedParamFolder.some(filePath =>
        filePath.includes(`${childIndex} `)
      );
    
      if (!alreadyExists) {
        console.log('resuming', childIndex);
        await recursiveClaimAnalysis(statement, childIndex, folderPath, analysisObject.contexto);
      }
    }
  }  
} else {
  // ————————————————————————————————————————————————
  //  NEW: guarantee root directory and write claim.md
  // ————————————————————————————————————————————————
  await Deno.mkdir(rootDirName, { recursive: true });
  const claimMdPath = join(rootDirName, 'claim.md');
  const claimMdContent = `deno run --allow-read --allow-env --allow-write --allow-net main.ts \"${claimRoot}\"` + "\n";
  await Deno.writeTextFile(claimMdPath, claimMdContent);
  
  await recursiveClaimAnalysis(claimRoot, '0', rootDirName);
}

console.log('Claim analysis completed.');
