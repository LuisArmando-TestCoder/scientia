/**
 * Helper function to generate a SHA-256 hash as a hex string.
 * Uses the provided input (typically a concatenation of news source properties and a timestamp).
 *
 * @param input - The input string.
 * @returns A promise that resolves to a hex string representing the hash.
 */
export default async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
