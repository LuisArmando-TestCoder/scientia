import log from "../log.ts";
import isValidAlpha2CountryCode from "../isValid/isValidAlpha2CountryCode.ts";

// Basic mapping of common country names/variants to ISO 3166-1 alpha-2 codes
// This list can be expanded as needed. Case-insensitive matching is used.
const countryMap: Record<string, string> = {
  // Common Names & Variants
  "united states": "US",
  "usa": "US",
  "united states of america": "US",
  "america": "US",
  "canada": "CA",
  "mexico": "MX",
  "united kingdom": "GB",
  "uk": "GB",
  "great britain": "GB",
  "england": "GB", // Technically part of GB, but often used
  "germany": "DE",
  "france": "FR",
  "spain": "ES",
  "italy": "IT",
  "australia": "AU",
  "new zealand": "NZ",
  "japan": "JP",
  "china": "CN",
  "india": "IN",
  "brazil": "BR",
  "argentina": "AR",
  "costa rica": "CR",
  "panama": "PA",
  "colombia": "CO",
  "ecuador": "EC",
  "peru": "PE",
  "chile": "CL",
  "guatemala": "GT",
  "honduras": "HN",
  "nicaragua": "NI",
  "el salvador": "SV",
  "belize": "BZ",
  "ireland": "IE",
  "netherlands": "NL",
  "switzerland": "CH",
  "sweden": "SE",
  "norway": "NO",
  "denmark": "DK",
  "portugal": "PT",
  "south africa": "ZA",
  // Add more common names, misspellings, or alternative codes if needed

  // Common Alpha-3 to Alpha-2 (optional, but can help)
  // "usa": "US", // Removed duplicate - already covered above
  "can": "CA",
  "mex": "MX",
  "gbr": "GB",
  "deu": "DE",
  "fra": "FR",
  "esp": "ES",
  "ita": "IT",
  "aus": "AU",
  "nzl": "NZ",
  "jpn": "JP",
  "chn": "CN",
  "ind": "IN",
  "bra": "BR",
  "arg": "AR",
  "cri": "CR",
  "pan": "PA",
  "col": "CO",
  // ... add more alpha-3 if necessary
};

/**
 * Attempts to convert a given string (country name, variant, or code)
 * into a valid ISO 3166-1 alpha-2 country code.
 * Returns the valid alpha-2 code or an empty string if no match is found or input is invalid.
 * @param inputCountryString The country string from AI output.
 * @returns The corresponding alpha-2 code or "".
 */
export default function countryToAlpha2(inputCountryString: string | null | undefined): string {
  if (!inputCountryString || typeof inputCountryString !== 'string') {
    return ""; // Handle null, undefined, or non-string input
  }

  const trimmedInput = inputCountryString.trim();
  if (!trimmedInput) {
    return ""; // Handle empty or whitespace-only strings
  }

  // 1. Check if it's already a valid alpha-2 code (case-insensitive)
  const upperInput = trimmedInput.toUpperCase();
  if (isValidAlpha2CountryCode(upperInput)) {
    return upperInput; // Return the valid code in uppercase
  }

  // 2. Try mapping common names/variants (case-insensitive)
  const lowerInput = trimmedInput.toLowerCase();
  if (countryMap[lowerInput]) {
    log(`INFO: [countryToAlpha2] Mapped "${trimmedInput}" to "${countryMap[lowerInput]}"`);
    return countryMap[lowerInput];
  }

  // 3. If no match found, return empty string
  log(`WARN: [countryToAlpha2] Could not map "${trimmedInput}" to a valid alpha-2 code.`);
  return "";
}
