import * as cheerio from "npm:cheerio";
import fetchScrape from "./fetchScrape.ts";

/**
 * Removes all attributes from an element except for "id", "class", and "href".
 *
 * @param {cheerio.Element} el - The element to process.
 */
function removeNonEssentialAttributes(el: cheerio.Element): void {
  const attrs = { ...el.attribs };
  for (const attr in attrs) {
    if (attr !== "id" && attr !== "class" && attr !== "href") {
      delete el.attribs[attr];
    }
  }
}

/**
 * Removes all text nodes (innerText) from an element.
 *
 * @param {cheerio.Element} el - The element to process.
 * @param {cheerio.Root} $ - The Cheerio instance.
 */
function removeInnerTextNodes(el: cheerio.Element, $: cheerio.Root): void {
  $(el)
    .contents()
    .filter(function () {
      return this.type === "text";
    })
    .remove();
}

/**
 * Simplifies the DOM by:
 * 1. Removing non-essential tags (<script>, <style>, <head>).
 * 2. Traversing each element once to:
 *    a. Remove attributes other than "id", "class", and "href".
 *    b. Remove text nodes.
 *
 * @param {string} html - The original HTML.
 * @returns {string} The simplified HTML.
 */
function simplifyDOMChain(html: string): string {
  const $ = cheerio.load(html);

  // Remove tags that do not contribute to the main content
  $("script, style, head, nav").remove();

  // Traverse every element once and apply both transformations
  $("*").each((_, el) => {
    removeNonEssentialAttributes(el);
    removeInnerTextNodes(el, $);
  });

  return $.html();
}

/**
 * Given a URL, fetches the HTML using fetchScrape and simplifies it.
 *
 * @param {string} url - The URL from which to fetch the HTML (article or blog).
 * @returns {Promise<string>} The simplified HTML.
 */
export default async function simplifyDOMForLookUp(url: string): Promise<string> {
  const html = await fetchScrape(url);
  return simplifyDOMChain(html);
}
