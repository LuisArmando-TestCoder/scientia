/// <reference lib='deno.ns' />

// ———————————————————————————————————————————————————————————————
//  Dependencies
// ———————————————————————————————————————————————————————————————
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';
import { getClaimAnalysis } from './scientia.ts';

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

const args = Deno.args;
if (args.length === 0) {
  console.error('Please provide a claim to analyze.');
  Deno.exit(1);
}

const claimRoot = args.join(' ');
const rootDirName = `proposiciones/${slugify(claimRoot) || 'root_claim'}`;

async function recursiveClaimAnalysis(
  claim: string,
  prefix: string,
  baseDir: string,
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
      subtasks.push(recursiveClaimAnalysis(`${subClaim} (contexto: ${claim})`, nextPrefix, baseDir));
    }
  }

  for (const task of subtasks) await task;
}

await recursiveClaimAnalysis(claimRoot, '0', rootDirName);

console.log('Claim analysis completed.');
