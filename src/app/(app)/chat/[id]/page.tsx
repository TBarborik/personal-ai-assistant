import { ChatScreen } from "@/components/chat/chat-screen";
import { getConversationMessages } from "@/lib/db/conversations";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: ChatPageProps) {
  return (
    <Suspense fallback={<div className="p-6">Načítám konverzaci...</div>}>
      <ChatContent params={params} />
    </Suspense>
  );
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    notFound();
  }

  let messages: Awaited<ReturnType<typeof getConversationMessages>> = [];
  try {
    messages = (await getConversationMessages(id)) ?? [];
  } catch (err) {
    console.error(err);
  }

  return <ChatScreen id={id} initialMessages={messages} />;
}
