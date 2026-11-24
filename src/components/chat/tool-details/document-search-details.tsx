import { documentSearchResultsScheme } from "@/lib/ai/schemas/document-search";
import { ToolDetailsProps } from "../tool-ui-config";
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import { Download, FileText, Search } from "lucide-react";

export function DocumentSearchDetails({ input, output }: ToolDetailsProps) {
  const parsed = documentSearchResultsScheme.safeParse(output);

  if (!parsed.success) return null;

  const results = parsed.data;
  const query =
    typeof input === "object" &&
    input !== null &&
    "query" in input &&
    typeof input.query === "string"
      ? input.query
      : null;

  return (
    <Trace>
      {query && (
        <TraceLine>
          <TraceIcon>
            <Search />
          </TraceIcon>
          <TraceTitle>{query}</TraceTitle>
          <TraceDescription>{results.length} výsledků</TraceDescription>
        </TraceLine>
      )}

      {results.map(result => (
        <a key={result.chunkId} href={`/api/files/${encodeURIComponent(result.documentId)}`} title="Stáhnout zdrojový dokument">
            <TraceLine>
                <TraceIcon><FileText /></TraceIcon>
                <TraceTitle>{result.documentName}</TraceTitle>
                <TraceDescription>#{result.position + 1}{" · "}{result.similarity.toFixed(3)}</TraceDescription>
                <TraceIcon><Download /></TraceIcon>
            </TraceLine>
        </a>
      ))}

      {results.length === 0 && (
        <TraceLine>
            <TraceTitle>Nebyly nalezeny relevantní dokumenty.</TraceTitle>
        </TraceLine>
      )}
    </Trace>
  );
}
