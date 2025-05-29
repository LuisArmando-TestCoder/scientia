import fetchWithAuth from "../fetchWithAuth.ts";

// Helper: Fetch Firestore data and handle errors
export default async (url: string) => {
  try {
    // fetchWithAuth now returns the raw Response object
    const response = await fetchWithAuth(url, { method: "GET" });
    // Parse the JSON body from the response
    const data = await response.json();
    // Return the parsed data (which should contain 'fields' or 'documents' depending on the API called)
    // The caller (e.g., getSystemConfig) will handle extracting the relevant part.
    return data || null;
  } catch (error) {
    // Handle potential 404 specifically if needed, otherwise rethrow generic error
     if (error instanceof Error && error.message.includes("404")) {
       console.warn(`Firestore document not found at URL: ${url}`);
       return null; // Return null if document not found
     }
    throw new Error(`Firestore fetch failed: ${error.message || error}`);
  }
};
