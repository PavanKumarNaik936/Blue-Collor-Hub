"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ConnectedUsers({ selectedUser }) {
  const { data: session } = useSession();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchConnections = async () => {
      try {
        const { data } = await axios.get(`/api/user/${userId}/connections`);
        console.log(data);
        setConnectedUsers(data.connections || []);
      } catch (err) {
        console.error("Failed to fetch connections:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId]);

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading connections...</p>;
  if (!session)
    return <p className="text-center text-gray-500 mt-4">Please login to see your connections.</p>;
  if (!connectedUsers.length)
    return <p className="text-center text-gray-500 mt-4">No connected users yet.</p>;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 max-w-xs w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Connections</h3>
      <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
        {connectedUsers.map((u) => (
          <li key={u._id}>
            <button
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                selectedUser === u._id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
              onClick={() => router.push(`/dashboard/chat?user=${u._id}`)}
            >
              {/* Avatar */}
              {u.profilePic ? (
                <img
                  src={u.profilePic}
                  alt={u.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-sm">
                  {u.name?.charAt(0) || "U"}
                </div>
              )}
              {/* Name */}
              <span className="truncate">{u.name || u.email}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
