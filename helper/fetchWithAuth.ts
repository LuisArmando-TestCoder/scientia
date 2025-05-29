import getAccessToken from "./getAccessToken.ts";

export default async (url: string, options: RequestInit) => {
  const accessToken = await getAccessToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    // Read the error text only if response is not ok
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  // Return the raw Response object for the caller to handle
  return response;
};
