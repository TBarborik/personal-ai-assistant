"use client";

import { DocumentSearchResult } from "@/lib/ai/schemas/document-search";
import { Streamdown } from "streamdown";
import { DocumentCitation } from "./document-citation";

type MessageTextProps = {
  text: string;
  sources: Map<string, DocumentSearchResult>;
  straming?: boolean;
};

export function MessageText({ text, sources, straming }: MessageTextProps) {
  return (
    <Streamdown
      className="not-first:mt-2"
      mode={straming ? "streaming" : "static"}
      allowedTags={{ "doc-citation": ["chunk_id"] }}
      components={{
        "doc-citation": ({ chunk_id }) => {
          console.log(chunk_id)
          const source = chunk_id && typeof chunk_id === "string" ? sources.get(chunk_id) : undefined;
          if (!source) return null;
          
          return <DocumentCitation source={source} />;
        },
      }}
    >
      {text}
    </Streamdown>
  );
}
