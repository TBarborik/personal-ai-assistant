import { createDocument } from "@/lib/db/storage";
import { processDocument } from "@/lib/documents/process-document";
import {
  deleteStoredDocument,
  getFileType,
  saveDocument,
} from "@/lib/documents/storage";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 5 * 1_024 * 1_024;
const ALLOWED_EXTENSIONS = new Set(["txt", "md", "pdf"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Soubor nebyl přiložen." }, { status: 400 });
  }

  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "Soubor musí mít velikost mezi 1B až 5 MB." },
      { status: 413 },
    );
  }

  const ext = (await getFileType(file))?.ext;

  if (!ext || !ALLOWED_EXTENSIONS.has(ext.toLocaleLowerCase())) {
    return Response.json(
      { error: `Formát ${ext ?? ""} není podporovaný. ${file}` },
      { status: 413 },
    );
  }

  const buffer = new Uint8Array(await file.arrayBuffer());

  try {
    if (ext !== "pdf") new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return Response.json(
      { error: "Soubor neobsahuje platný UTF-8 text." },
      { status: 415 },
    );
  }

  const storageKey = randomUUID();
  let document;

  try {
    await saveDocument(storageKey, buffer);
    document = await createDocument(file, storageKey);
  } catch (error) {
    await deleteStoredDocument(storageKey).catch(() => {});
    return Response.json(
      { error: "Soubor se nepodařilo uložit." },
      { status: 500 },
    );
  }

  try {
    const processedDocument = await processDocument(document.id);
    return Response.json(
      {
        id: processedDocument.id,
        mimeType: processedDocument.mimeType,
        name: processedDocument.name,
        status: processedDocument.status,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        error: "Soubor se podařilo uložit, ale už ne zprocesovat.",
      },
      { status: 201 },
    );
  }
}
