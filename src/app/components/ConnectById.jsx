// components/ConnectById.jsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function ConnectById({ senderId }) {
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  const sendRequest = async () => {
    try {
      const { data } = await axios.post("/api/user/send-request", {
        senderId,
        receiverId,
      });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Enter User ID to connect"
        className="border p-2 mr-2"
      />
      <button
        onClick={sendRequest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send Request
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
