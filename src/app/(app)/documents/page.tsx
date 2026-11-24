import { DocumentTable } from "@/components/documents/document-table";
import { DocumentUpload } from "@/components/documents/document-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocuments } from "@/lib/db/storage";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dokumenty</h1>
        <p className="text-sm text-muted-foreground">Správa znalostní báze asistenta.</p>
      </div>
      <DocumentUpload />

      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <DocumentList />
      </Suspense>
    </div>
  );
}

async function DocumentList() {
    await connection();
    const documents = await getDocuments();
    return <DocumentTable documents={documents} />
}