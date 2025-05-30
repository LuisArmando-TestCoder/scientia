/// <reference lib="deno.ns" />
import { getClaimAnalysis } from "./scientia.ts";

// For putting recursive promises in a queue to avoid stack overflow and api rate limits
class SynchronousTaskQueue {
    private queue: (() => Promise<any>)[] = [];
    private isRunning: boolean = false;

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
        if (this.isRunning || this.queue.length === 0) {
            return;
        }
        this.isRunning = true;
        const taskWrapper = this.queue.shift();
        if (taskWrapper) {
            try {
                await taskWrapper();
            } catch (e) {
                console.error("Error during task execution in queue:", e);
            } finally {
                this.isRunning = false;
                this.processQueue();
            }
        } else {
            this.isRunning = false;
        }
    }
}
function createQueuedExecutor<A extends any[], R>(
    asyncFunction: (...args: A) => Promise<R>,
    queue: SynchronousTaskQueue
): (...args: A) => Promise<R> {
    return (...args: A): Promise<R> => {
        return queue.add(() => asyncFunction(...args));
    };
}

const apiCallQueue = new SynchronousTaskQueue();

const queuedGetClaimAnalysis = createQueuedExecutor(getClaimAnalysis, apiCallQueue);


console.log("Starting claim analysis...");

const args = Deno.args;
if (args.length === 0) {
  console.error("Please provide a claim to analyze.");
  Deno.exit(1);
}
const claim = args.join(" ");

async function recursiveClaimAnalysis(claim: string, recursionLevel: number = 0) {
  console.log("claim: ", claim);
  const analysis = await queuedGetClaimAnalysis(claim); 
  const promisedClaims: Promise<void>[] = []

  console.log("Recursion level: ", recursionLevel);
  console.log("reevaluacion_global: ", analysis.reevaluacion_global);

  for (const [
    subClaim, truth, contradiction, uncertainty,
  ] of analysis.tabla_verdad.filas) {
    console.log(`sub claim: `, subClaim, ` (${
        truth ? "true" : contradiction ? "false" : uncertainty === 1 ? "uncertain" : "self-referential"
    })`);
    if (uncertainty === 1) {
        promisedClaims.push(recursiveClaimAnalysis(subClaim, recursionLevel + 1)); // Used subClaim
    }
  }

  for (const promisedClaim of promisedClaims) {
    await promisedClaim;
  }
}

await recursiveClaimAnalysis(claim);

// TODO: Back propagate last non-self-referencing collapsed claims to the parent claims all the way up to the root claim
console.log("Claim analysis completed.");