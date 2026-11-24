import { deleteDocument as deleteDocumentFromDb } from "../db/storage";
import { deleteStoredDocument } from "./storage";

export async function deleteDocument(id: string) {
  const document = await deleteDocumentFromDb(id);
  try {
    deleteStoredDocument(document.storageKey);
  } catch (error) {
    console.error("[DOCUMENT STORAGE CLEANUP", error);
  }
}
