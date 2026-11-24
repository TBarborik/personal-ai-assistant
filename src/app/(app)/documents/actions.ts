"use server";

import { deleteDocument } from "@/lib/documents/delete-document";
import { processDocument } from "@/lib/documents/process-document";
import { revalidatePath } from "next/cache";

export async function deleteDocumentAction(id: string) {
  try {
    await deleteDocument(id);
    revalidatePath("/documents");

    return {
      success: true,
      message: "Dokument byl smazán.",
    };
  } catch (err) {
    console.error("[DELETE DOCUMENT]", err);
    return {
      success: false,
      message: "Dokument se nepodařilo smazat.",
    };
  }
}

export async function reprocessDocumentAction(id: string) {
    try {
        const document = await processDocument(id);
        revalidatePath("/documents");
        return {
            success: document.status === "READY",
            message: document.status === "READY" ? "Dokument byl znovu zpracován." : "Zpracování dokumentu selhalo."
        }
    } catch (err) {
        console.error("[REPROCESS DOCUMENT]", err);
        return {
            success: false,
            message: "Dokument se nepodařilo zpracovat."
        }
    }
}
