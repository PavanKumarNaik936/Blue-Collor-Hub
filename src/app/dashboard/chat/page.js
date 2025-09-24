"use client";

import { useSearchParams } from "next/navigation";
import ChatSection from "@/app/components/ChatSection";

export default function DashboardChatPage() {
  const searchParams = useSearchParams();
  const chatWith = searchParams.get("user"); // user ID from query

  return (
    <div className="flex flex-1 h-full p-6">
      <ChatSection chatWith={chatWith} />
    </div>
  );
}
