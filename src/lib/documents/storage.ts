import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { fileTypeFromBlob } from "file-type";

const STORAGE_DIR = path.resolve(
  process.env.DOCUMENT_STORAGE_DIR ?? "./storage/documents",
);

export async function saveDocument(storageKey: string, data: Uint8Array) {
  await mkdir(STORAGE_DIR, { recursive: true });
  const filePath = path.join(STORAGE_DIR, storageKey);
  await writeFile(filePath, data, { flag: "wx" });
}

export async function deleteStoredDocument(storageKey: string) {
  const filePath = path.join(STORAGE_DIR, storageKey);
  await unlink(filePath);
}

export async function readStoredDocument(storageKey: string): Promise<Buffer> {
  if (!/^[0-9a-f-]{36}$/i.test(storageKey)) {
    throw new Error("Invalid document storage key.");
  }

  return readFile(path.join(STORAGE_DIR, storageKey));
}

export async function getFileType(
  file: File,
): ReturnType<typeof fileTypeFromBlob> {
  const type = await fileTypeFromBlob(file);

  if (type) {
    return type;
  }

  const ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
  const mime = extToMime(ext);

  return {
    ext: ext,
    mime: mime,
  };
}

function extToMime(ext: string): string {
  switch (ext.toLocaleLowerCase()) {
    case "txt":
      return "text/plain";
    case "md":
      return "text/markdown";
    default:
      return "text/" + ext;
  }
}
