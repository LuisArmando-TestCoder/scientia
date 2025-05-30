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
async function recursiveClaimAnalysis(claim: string) {
  console.log("claim: ", claim);
  const analysis = await getClaimAnalysis(claim);

  for (const [
    claim, truth, contradiction, uncertainty,
  ] of analysis.tabla_verdad.filas) {
    if (uncertainty === 1) {
        // on purpose the await is synchronous to avoid too many cuncurrent requests
        await recursiveClaimAnalysis(claim);
    }
  }
}
const analysis = await recursiveClaimAnalysis(claim);
