"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileEditForm from "@/app/components/ProfileEditForm";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchUser = async () => {
      try {
        const userId = session.user.id;
        const { data } = await axios.get(`/api/user/${userId}`);
        setUserDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  if (!session) return <div>Please login</div>;
  if (loading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user data found</div>;

  const isValid = (value) => value !== null && value !== undefined && value !== "";

  return (
    <div className="p-4 space-y-4 max-w-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <ProfileEditForm
          user={userDetails}
          onSave={(updatedUser) => {
            setUserDetails(updatedUser);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-2">
          {isValid(userDetails.name) && <h2 className="text-xl">{userDetails.name}</h2>}
          {isValid(userDetails.email) && <p><strong>Email:</strong> {userDetails.email}</p>}
          {isValid(userDetails.title) && <p><strong>Title:</strong> {userDetails.title}</p>}
          {isValid(userDetails.phone) && <p><strong>Phone:</strong> {userDetails.phone}</p>}
          {isValid(userDetails.whatsappNo) && <p><strong>WhatsApp:</strong> {userDetails.whatsappNo}</p>}
          {isValid(userDetails.profilePic) && (
            <img
              src={userDetails.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
}
