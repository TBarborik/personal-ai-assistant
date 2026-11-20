import { webSearchResultsSchema } from "@/lib/ai/schemas/web-search";
import { ToolDetailsProps } from "../tool-ui-config";
import { Trace, TraceDescription, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";
import { ArrowUpRight, Globe } from "lucide-react";

export function WebSearchDetails({
    input,
    output
}: ToolDetailsProps) {
    const parsed = webSearchResultsSchema.safeParse(output)

    if (!parsed.success) {
        return (
            <p className="text-sm text-muted-foreground">
                Výsledky vyhledávání nejsou dostupné.
            </p>
        )
    }

    const sources = Array.from(new Map(parsed.data.map(item => [item.url, item])).values())
    const query = typeof input === "object" && input !== null && "query" in input && typeof input.query === "string" ? input.query : null;

    return (
        <Trace>
            {query && (
                <TraceLine>
                    <TraceIcon><Globe /></TraceIcon>
                    <TraceTitle>{query}</TraceTitle>
                    <TraceDescription>{sources.length} zdrojů</TraceDescription>
                </TraceLine>
            )}

            {sources.map(source => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer noopener">
                    <TraceLine>
                        <TraceIcon><Globe /></TraceIcon>
                        <TraceTitle>{source.title}</TraceTitle>
                        <TraceIcon><ArrowUpRight /></TraceIcon>
                    </TraceLine>
                    <span className="sr-only">Otevře se v nové kartě</span>
                </a>
            ))}

            {sources.length === 0 && (
                <TraceLine><TraceTitle>Nebyly nalezeny žádné výsledky.</TraceTitle></TraceLine>
            )}
        </Trace>
    )
}