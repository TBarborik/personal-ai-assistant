"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ModelSelect } from "@/components/chat/model-select";
import { TokenUsagePopover } from "@/components/chat/token-usage-popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ModelId } from "@/lib/ai/model-catalog";
import { type AppUIMessage } from "@/lib/ai/types";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeaderActions } from "../layout/header-actions-context";
import { notifyConversationsUpdated } from "@/lib/events";

type ChatScreenProps = {
  id: string;
  initialMessages: AppUIMessage[];
};

export function ChatScreen({ id, initialMessages }: ChatScreenProps) {
  const router = useRouter();
  const [model, setModel] = useState<ModelId>("claude");
  const { setActions } = useHeaderActions();

  const { messages, sendMessage, status, stop, error } =
    useChat<AppUIMessage>({
      id: id,
      messages: initialMessages,
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
      onFinish: ({ message, isAbort, isError }) => {
        if (isAbort || isError) return;

        notifyConversationsUpdated();

        const usage = message.metadata?.usage;
        if (!usage) return;

        toast.add({
          title: "Spotřeba dotazu",
          description: (
            <>
              {`Vstup: ${usage.inputTokens} tokenů`} <br />{" "}
              {`Výstup: ${usage.outputTokens} tokenů`} <br />{" "}
              {`Celkem: ${usage.totalTokens} tokenů`}
            </>
          ),
        });
      },
    });

  useEffect(() => {
    setActions(
      <div className="flex items-center gap-2">
        <TokenUsagePopover messages={messages} />
        <ModelSelect
          value={model}
          onChange={setModel}
          disabled={["submitted", "streaming"].includes(status)}
        />
      </div>,
    );

    return () => setActions(null);
  }, [messages, model, status, setActions]);

  const handleSend = (content: string) => {
    sendMessage(
      { text: content },
      {
        body: {
          model: model,
          conversationId: id,
        },
      },
    );
  };

  const handleNewChat = () => {
    stop().then(() => {
      router.push("/");
    });
  };

  return (
    <>
      <ChatMessages messages={messages} conversationId={id} status={status} />
      {error && (
        <Alert>
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>Nepodařilo se získat odpověď</AlertDescription>
        </Alert>
      )}
      <ChatInput onSend={handleSend} onStop={stop} status={status} />
      <Button type="button" className="mb-2" onClick={handleNewChat}>
        Nová konverzace
      </Button>
    </>
  );
}
