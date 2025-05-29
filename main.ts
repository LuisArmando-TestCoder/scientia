import { getClaimAnalysis } from "./scientia.ts";

console.log("Starting claim analysis...");

const claim = "Si queremos recibir lo que se recibe al dar, entonces debemos dar";
const analysis = await getClaimAnalysis(claim)

console.log("Claim Analysis:", analysis);