import { getClaimAnalysis } from "./scientia.ts";

console.log("Starting claim analysis...");

// claim from the user command line 
const args = Deno.args;
if (args.length === 0) {
  console.error("Please provide a claim to analyze.");
  Deno.exit(1);
}
const claim = args.join(" ");

// Recursive function to analyze the claim
async function recursiveClaimAnalysis(claim: string, recursionLevel: number = 0) {
  console.log("claim: ", claim);
  const analysis = await getClaimAnalysis(claim);
  const promisedClaims: Promise<void>[] = []

  console.log("Recursion level: ", analysis);
  console.log("evaluacion_global: ", analysis.evaluacion_global);

  for (const [
    claim, truth, contradiction, uncertainty,
  ] of analysis.tabla_verdad.filas) {
    console.log(`sub claim: `, claim, ` (${
        truth ? "true" : contradiction ? "false" : uncertainty === 1 ? "uncertain" : "self-referential"
    })`);
    if (uncertainty === 1) {
        // on purpose the await is synchronous to avoid too many cuncurrent requests
        promisedClaims.push(recursiveClaimAnalysis(claim, recursionLevel + 1));
    }
  }

  for (const promisedClaim of promisedClaims) {
    await promisedClaim;
  }
}

await recursiveClaimAnalysis(claim);

// TODO: Back propagate last non-self-referencing collapsed claims to the parent claims all the way up to the root claim
console.log("Claim analysis completed.");