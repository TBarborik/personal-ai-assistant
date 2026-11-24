"use client";

import { DocumentSearchResult } from "@/lib/ai/schemas/document-search";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Badge } from "../ui/badge";
import { FileText } from "lucide-react";

type DocumentCitationProps = {
    source: DocumentSearchResult
}

export function DocumentCitation({
    source
}: DocumentCitationProps) {
    const href = `/api/files/${encodeURIComponent(source.documentId)}`;

    return (
        <HoverCard>
            <HoverCardTrigger render={<a href={href} />}>
                <Badge variant="outline" className="cursor-pointer"><FileText className="size-3" /> {source.documentName}</Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">{source.documentName}</p>
                    <p className="text-xs text-muted-foreground">Úryvek {source.position + 1}{" · "} Skóre {source.similarity.toFixed(3)}</p>
                    <p className="line-clamp-6 text-sm">{source.content}</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}