"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function PendingRequests() {
  const { data: session, status } = useSession();
  const [pending, setPending] = useState([]);
  const userId = session?.user?.id;

  // Fetch pending requests
  useEffect(() => {
    if (!userId) return;

    async function fetchPending() {
      try {
        const { data } = await axios.get(`/api/user/${userId}/pending-requests`);
        setPending(data.requests || []);
      } catch (err) {
        console.error("Failed to fetch pending requests:", err);
      }
    }

    fetchPending();
  }, [userId]);

  const acceptRequest = async (senderId) => {
    try {
      await axios.post("/api/user/accept-request", { receiverId: userId, senderId });
      setPending(prev => prev.filter(u => u._id !== senderId));
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  if (status === "loading") return <p>Loading pending requests...</p>;
  if (!userId) return <p>Please login to see pending requests.</p>;
  if (pending.length === 0) return <p className="text-gray-500">No pending requests.</p>;

  return (
    <div className="mt-4 bg-white rounded-xl shadow border border-gray-200 p-4 max-w-md mx-auto">
      <h2 className="font-semibold text-lg mb-3">Pending Requests</h2>
      {/* Scrollable container */}
      <ul className="space-y-3 max-h-80 overflow-y-auto">
        {pending.map((u) => (
          <li
            key={u._id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {u.profilePic ? (
                <img
                  src={u.profilePic}
                  alt={u.name || u.email}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                  {u.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">{u.name || u.email}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
            <button
              onClick={() => acceptRequest(u._id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium transition"
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
