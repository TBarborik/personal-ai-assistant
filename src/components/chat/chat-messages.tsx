"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ChatStatus, ToolUIPart, UIMessage } from "ai";
import { Streamdown } from "streamdown";
import { useEffect, useLayoutEffect, useRef } from "react";
import { isNearBottom, scrollToBottom } from "@/lib/scroll";
import { ToolTrace } from "./tool-trace";
import { AppUIMessage } from "@/lib/ai/types";

export type SimpleMessage = {
  id: string;
  role: UIMessage["role"];
  content: string;
};

type ChatMessagesProps = {
  messages: (SimpleMessage | UIMessage)[];
  conversationId: string;
  status: ChatStatus;
};

export function ChatMessages({ messages, conversationId, status }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  const handleScroll = () => {
    if (containerRef.current)
      autoScrollRef.current = isNearBottom(containerRef.current);
  };

  useLayoutEffect(() => {
    autoScrollRef.current = true;
    scrollToBottom(containerRef.current, true);
  }, [conversationId]);

  useEffect(() => {
    if (autoScrollRef.current) scrollToBottom(containerRef.current);
  }, [messages]);

  return (
    <div
      className="min-h-0 w-full flex-1 overflow-y-auto px-4 py-6"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">S čím ti mohu pomoci?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Zeptej se nebo prohledej svoje dokumenty.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn({
              "flex justify-end": message.role === "user",
              "flex justify-start": message.role === "assistant",
            })}
          >
            <div
              className={cn([
                "max-w-[85%] text-sm flex flex-col gap-1",
                {
                  "rounded-2xl bg-primary px-4 py-3 text-primary-foreground":
                    message.role === "user",
                  "px-2 py-3 bg-secondary rounded-2xl":
                    message.role === "assistant",
                },
              ])}
            >
              {message.role === "assistant" && <Badge>Asistent</Badge>}
              {"content" in message ? (
                <p>{message.content}</p>
              ) : (
                message.parts.map((part, idx) => (
                  <Message part={part} key={idx} status={status} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Message({ part, status }: { part: AppUIMessage["parts"][number]; status?: ChatStatus }) {
  if (part.type === "text") {
    return <Streamdown mode={status === "streaming" ? "streaming" : "static"} className="not-first:mt-2">{part.text}</Streamdown>;
  } else if (part.type.startsWith("tool-")) {
    return (
      <ToolTrace part={part as ToolUIPart} />
    );
  }

  return null;
}
