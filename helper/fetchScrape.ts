import getAntiAntiScrapeFetchOptionsBrowserHeaders from "./getAntiAntiScrapeFetchOptionsBrowserHeaders.ts";

export default async (url: string): Promise<string> => {
  const response = await fetch(url, getAntiAntiScrapeFetchOptionsBrowserHeaders());

  if (!response.ok) {
    throw new Error(`${url} request failed with status ${response.status}`);
  }

  const html = await response.text();
  return html;
};
