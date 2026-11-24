import { DocumentSearchResult, documentSearchResultsScheme } from "./schemas/document-search";
import { AppUIMessage } from "./types";

export function getDocumentSources(message: AppUIMessage) {
    const sources = new Map<string, DocumentSearchResult>();

    for (const part of message.parts) {
        if (part.type !== "tool-searchDocuments")
            continue;

        if (part.state !== "output-available")
            continue;

        const parsed = documentSearchResultsScheme.safeParse(part.output);

        if (!parsed.success)
            continue;

        for (const source of parsed.data)
            sources.set(source.chunkId, source)
    }

    return sources;
}