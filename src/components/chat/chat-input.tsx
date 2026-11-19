"use client";

import { SubmitEvent, useState, KeyboardEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { StopCircle } from "lucide-react";
import { ChatStatus } from "ai";

type ChatInputProps = {
  onSend: (message: string) => void;
  status: ChatStatus;
  onStop?: () => void;
};

export function ChatInput({ onSend, onStop, status }: ChatInputProps) {
  const [message, setMessage] = useState<string>("");

  const isGenerating = ["submitted", "streaming"].includes(status);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isGenerating) return;

    const chatMessage = message.trim();

    if (!chatMessage) return;

    onSend(chatMessage);
    setMessage("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="shrink-0 w-full border-t p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-2"
      >
        <Textarea
          aria-label="Zpráva pro asistenta"
          placeholder="Napiš zprávu..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="max-h-40 min-h-12 resize-none"
        />
        {isGenerating && onStop ? (
          <Button onClick={() => onStop()} type="button" size="icon" aria-label="Zastavit generování">
            <StopCircle />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isGenerating}
            aria-label="Odeslat zprávu"
          >
            <ArrowUp />
          </Button>
        )}
      </form>
    </div>
  );
}
