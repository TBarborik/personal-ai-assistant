import "server-only";
import { getDocumentProxy, extractText as extractPdfText } from "unpdf";

export async function extractText(
  buffer: Uint8Array,
  mimeType: string,
): Promise<string> {
  switch (mimeType) {
    case "text/plain":
    case "text/md":
    case "text/markdown": {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);

      return normalizeText(text);
    }
    case "application/pdf": {
      const pdf = await getDocumentProxy(new Uint8Array(buffer), {
        maxImageSize: 16_777_216,
      });

      try {
        if (pdf.numPages > 200)
            throw new Error("PDF exceeds the 200 page limit.")

        const result = await extractPdfText(pdf,  {mergePages: true});
        return normalizeText(result.text);
      } finally {
        await pdf.cleanup();
      }
    }
    default: {
      throw new Error(`Unsupported document type: ${mimeType}`);
    }
  }
}

function normalizeText(text: string): string {
  return text
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}
