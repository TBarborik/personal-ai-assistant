import { prisma } from "@/lib/db/prisma";
import { readStoredDocument } from "@/lib/documents/storage";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    select: {
      storageKey: true,
      name: true,
      mimeType: true,
    },
  });

  if (!document) {
    return Response.json({ error: "Dokument nebyl nalezen." }, { status: 404 });
  }

  try {
    const buffer = await readStoredDocument(document.storageKey);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition":
          "attachment; filename*=UTF-8''" + encodeURIComponent(document.name),
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[DOWNLOAD DOCUMENT]", err);
    return Response.json(
      { error: "Soubor se nepodařilo načíst." },
      { status: 500 },
    );
  }
}
