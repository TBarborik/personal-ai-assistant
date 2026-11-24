import { DocumentListItem } from "@/lib/db/storage"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { FileText, FolderOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DocumentStatus } from "./document-status"
import { formatFileSize } from "@/lib/format"
import { DocumentActions } from "./document-actions"

type DocumentTableProps = {
    documents: DocumentListItem[]
}

export function DocumentTable({documents}: DocumentTableProps) {
    if (documents.length === 0) {
        return (
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
                    <EmptyTitle>Žádné dokumenty</EmptyTitle>
                    <EmptyDescription>Nahraj svůj první dokument a rozšiř znalostní bázi asistenta.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Název</TableHead>
                    <TableHead>Velikost</TableHead>
                    <TableHead>Stav</TableHead>
                    <TableHead>Nahráno</TableHead>
                    <TableHead>Chunky</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {documents.map((document) => (
                    <TableRow key={document.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-muted-foreground" />
                                {document.name}
                            </div>
                        </TableCell>
                        <TableCell>{formatFileSize(document.size)}</TableCell>
                        <TableCell><DocumentStatus status={document.status} errorMessage={document.errorMessage} /></TableCell>
                        <TableCell>{document.createdAt.toLocaleDateString("cs-CZ")}</TableCell>
                        <TableCell>{document._count.chunks}</TableCell>
                        <TableCell className="text-end"><DocumentActions document={document} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}