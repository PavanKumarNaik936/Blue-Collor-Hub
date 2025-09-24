"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ChatSection({ chatWith }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [chatWithDetails, setChatWithDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef();

  // Scroll helper
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch chat user details
  useEffect(() => {
    if (!chatWith) return;

    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`/api/user/${chatWith}`);
        console.log(data);
        setChatWithDetails(data);
      } catch (err) {
        console.error(
          "Failed to fetch user details:",
          err.response?.data || err.message
        );
      }
    };

    fetchUserDetails();
  }, [chatWith]);

  // Fetch or create conversation and messages
  useEffect(() => {
    if (!userId || !chatWith) return;

    const fetchConversation = async () => {
      setLoading(true);
      try {
        // Create or get conversation
        const { data } = await axios.post("/api/chat/conversation", {
          participants: [userId, chatWith],
        });
        setConversationId(data._id);

        // Fetch previous messages
        const messagesRes = await axios.get(`/api/chat/${data._id}`);
        setMessages(messagesRes.data || []);
        scrollToBottom();
      } catch (err) {
        console.error(
          "Failed to fetch conversation/messages:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [userId, chatWith]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim() || !conversationId) return;

    const message = { sender: userId, receiver: chatWith, text, conversationId };

    // Optimistic UI update
    setMessages((prev) => [...prev, message]);
    setText("");
    scrollToBottom();

    try {
      await axios.post("/api/chat/message", message);
    } catch (err) {
      console.error(
        "Failed to save message:",
        err.response?.data || err.message
      );
    }
  };

  if (!chatWith)
    return (
      <p className="text-center text-gray-500 mt-20 text-base">
        Select a user to start chatting
      </p>
    );
  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20 text-base">Loading chat...</p>
    );

  return (
    <div className="flex flex-col h-[65vh] w-full relative -top-5 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
        {chatWithDetails?.profilePic ? (
          <img
            src={chatWithDetails.profilePic}
            alt={chatWithDetails.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-sm">
            {chatWithDetails?.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold">
            {chatWithDetails?.name || chatWithDetails?.email || "User"}
          </h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`max-w-[70%] px-3 py-2 rounded-2xl shadow-sm break-words text-sm ${
              msg.sender === userId
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 border-t border-gray-200 p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
