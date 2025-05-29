import { getClaimAnalysis } from "./scientia.ts";

console.log("Starting claim analysis...");

// claim from the user command line 
const args = Deno.args;
if (args.length === 0) {
  console.error("Please provide a claim to analyze.");
  Deno.exit(1);
}
const claim = args.join(" ");
const analysis = await getClaimAnalysis(claim)

console.log("Claim Analysis:", analysis);