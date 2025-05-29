export default function getAntiAntiScrapeFetchOptionsBrowserHeaders() {
  const userAgents = [
    // Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    // Firefox on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
    // Edge on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/115.0.0.0",
    // Brave on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Brave/1.40.0",
  ];

  const acceptLanguages = [
    "en-US,en;q=0.9",
    "es-ES,es;q=0.9,en;q=0.6",
    "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  ];

  const accepts = [
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  ];

  // Example sets for the Sec-CH headers. Real browsers generate them differently per user agent,
  // so you might also want to vary these or tailor them to the selected User-Agent.
  const secChUa = [
    `"Not.A/Brand";v="8", "Chromium";v="115", "Google Chrome";v="115"`,
    `"Not.A/Brand";v="8", "Chromium";v="115", "Brave";v="115"`,
  ];

  const secChUaPlatform = [`"Windows"`];

  // Random choice helper
  function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Possibly you want to pick a single user-agent with matching hints if you want them consistent:
  const pickedUserAgent = randomChoice(userAgents);
  const pickedUa = randomChoice(secChUa);
  const pickedPlatform = randomChoice(secChUaPlatform);

  // Some sites also respond well if you supply consistent "Host" and "Origin" for navigation
  return {
    headers: {
      // "Host" must match the domain you’re requesting:
      Host: "www.pexels.com",
      "User-Agent": pickedUserAgent,
      "Accept-Language": randomChoice(acceptLanguages),
      Accept: randomChoice(accepts),
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://www.pexels.com/",
      Origin: "https://www.pexels.com",
      Connection: "keep-alive",

      // Typical for navigations:
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
      DNT: "1", // '1' for "Do Not Track"

      // Sec-Fetch standard headers, can vary depending on whether you are "navigating" or making an AJAX request
      "Sec-Fetch-Site": "same-origin", // or "cross-site", depending on context
      "Sec-Fetch-Mode": "navigate", // or "cors", or "no-cors"
      "Sec-Fetch-User": "?1",
      "Sec-Fetch-Dest": "document",

      // Client Hints
      "sec-ch-ua": pickedUa,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": pickedPlatform,
      // You can add more:
      "sec-ch-ua-full-version": `"115.0.0.0"`,
      "sec-ch-ua-arch": `"x86"`,
      "sec-ch-ua-bitness": `"64"`,
      "sec-ch-ua-model": `""`,
      "sec-ch-ua-platform-version": `"15.0.0"`,

      // If you want an ephemeral 'trace token', sometimes sites see random "x-client-data" or such
      // "X-Client-Data": randomUUID(), // or something that looks more like Chrome’s. They have a custom format though.

      // Optional: if you stored any cookies from a prior request
      // "Cookie": "some_cookie_name=some_cookie_value;",
    },
  };
}
