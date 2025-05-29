import fromFirestoreFields from "../firestore/fromFirestoreFields.ts";

/**
 * Convert a Firestore document object into a proper JS object,
 * preserving arrays, maps, booleans, etc.
 */
export default function convertFromFirestoreDocument(
  doc: { fields?: any } | null
): any {
  if (!doc || !doc.fields) {
    return null;
  }
  return fromFirestoreFields(doc.fields);
}
