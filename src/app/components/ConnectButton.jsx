import { useState, useEffect } from "react";
import axios from "axios";

export default function ConnectButton({ senderId, receiverId }) {
  const [status, setStatus] = useState(""); // "", "Request sent", "Already connected", "error"
  const [loading, setLoading] = useState(false);

  // Check if users are already connected
  useEffect(() => {
    if (!senderId || !receiverId) return;

    const checkConnection = async () => {
      try {
        const { data } = await axios.get(
          `/api/user/check-connection?user1=${senderId}&user2=${receiverId}`
        );
        if (data.connected) setStatus("Already connected");
      } catch (err) {
        console.error("Connection check failed:", err.response?.data || err.message);
      }
    };

    checkConnection();
  }, [senderId, receiverId]);

  const handleConnect = async () => {
    if (!senderId) return alert("Please login to connect.");
    if (status === "Already connected") return;

    setLoading(true);
    setStatus(""); // reset status while sending request

    try {
      const { data } = await axios.post("/api/user/send-request", {
        senderId,
        receiverId,
      });

      setStatus(data.message || "Request sent");
    } catch (err) {
      setStatus(err.response?.data?.error || "Failed to send request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading || status === "Request sent" || status === "Already connected"}
      className={`px-4 py-1 font-semibold rounded-md border transition ${
        status === "Request sent" || status === "Already connected"
          ? "bg-green-500 text-white border-green-500 cursor-not-allowed"
          : "bg-white text-black border-black hover:bg-black hover:text-white"
      }`}
    >
      {loading ? "Connecting..." : status || "Connect"}
    </button>
  );
}
