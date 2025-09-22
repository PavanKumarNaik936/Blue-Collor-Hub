"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin } from "react-icons/fi";
import EditProfileModal from "@/app/components/EditProfileModal";
import connect from "../../../../lib/mongodb";
export default function ProfilePage() {
  const { data: session } = useSession();
  // console.log(session);
  const [userDetails, setUserDetails] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("posts"); // posts or media
  const [modalImage, setModalImage] = useState(null); // For large image view
  

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const userId = session?.user.id;
        console.log(userId);
        if(!userId)
          return;
        // Fetch user profile
        // console.log(userId);
        // await connect();
        const { data: userData } = await axios.get(`/api/user/${userId}`);
        setUserDetails(userData);

        // Fetch user posts
        // const { data: posts } = await axios.get(`/api/user/${userId}/posts`);
        setPostsData(posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) return <div>Please login</div>;
  if (loading) return <div>Loading...</div>;
  if (!userDetails) return <div>No user data found</div>;

  const isValid = (value) => value !== null && value !== undefined && value !== "";

  const displayedPosts =
    selectedTab === "posts"
      ? postsData
      : postsData.filter((post) => post.type === "image");

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={isValid(userDetails.coverImage) ? userDetails.coverImage : "/cover.jpg"}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <img
              src={isValid(userDetails.profilePic) ? userDetails.profilePic : "/profile.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="pt-4 px-6 pb-6">
          {/* Edit Button */}
          {!isEditing && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Edit
              </button>
            </div>
          )}

          {/* Profile Details */}
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              {/* Name */}
              <h1 className="text-3xl font-semibold truncate">
                {isValid(userDetails.name) ? userDetails.name : "John Doe"}
              </h1>

              {/* Bio */}
              <p className="text-gray-600 mt-1 max-w-[calc(100%-5rem)] break-words">
                {isValid(userDetails.bio) ? userDetails.bio : "No bio provided"}
              </p>

              {/* Mobile Number */}
              <p className="text-gray-700 mt-2">
                <span className="font-semibold">Mobile: </span>
                {isValid(userDetails.mobile) ? userDetails.mobile : "N/A"}
              </p>

              {/* Skill Category */}
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">Skill Category: </span>
                {isValid(userDetails.skillCategory) ? userDetails.skillCategory : "N/A"}
              </p>

              {/* Skill */}
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">Skill: </span>
                {isValid(userDetails.skill) ? userDetails.skill : "N/A"}
              </p>

              {/* Location */}
              <p className="text-gray-500 mt-2 flex items-center gap-1">
                <FiMapPin className="text-gray-500" />
                {isValid(userDetails.state) && isValid(userDetails.city)
                  ? `${userDetails.state}, ${userDetails.city}`
                  : "Unknown location"}
              </p>

              {/* Divider */}
              <hr className="my-4 border-gray-300 max-w-[calc(100%-5rem)]" />

              {/* Stats */}
              <div className="flex justify-start space-x-12">
                <div>
                  <p className="font-bold text-lg">{postsData.length}</p>
                  <p className="text-gray-500">Posts</p>
                </div>
                <div>
                  <p className="font-bold text-lg">1200</p>
                  <p className="text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="font-bold text-lg">180</p>
                  <p className="text-gray-500">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= POSTS / MEDIA SECTION ================= */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Tabs */}
        <div className="flex justify-center space-x-8 border-b border-gray-300">
          <button
            className={`px-4 py-2 font-semibold ${
              selectedTab === "posts" ? "border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("posts")}
          >
            Posts
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              selectedTab === "media" ? "border-b-2 border-black" : "text-gray-500"
            }`}
            onClick={() => setSelectedTab("media")}
          >
            Media
          </button>
        </div>

        {/* Posts / Media Content */}
        {selectedTab === "media" ? (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {displayedPosts.map((post) => (
              <div key={post._id} className="cursor-pointer">
                <img
                  src={post.content}
                  alt="Media"
                  className="w-full h-48 object-cover rounded"
                  onClick={() => setModalImage(post.content)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-4">
            {displayedPosts.map((post) =>
              post.type === "text" ? (
                <div key={post._id} className="p-4 border rounded bg-gray-50 break-words">
                  {post.content}
                </div>
              ) : (
                <div key={post._id} className="flex flex-col cursor-pointer">
                  <img
                    src={post.content}
                    alt="Post"
                    className="w-full h-64 object-cover rounded"
                    onClick={() => setModalImage(post.content)}
                  />
                  {post.text && (
                    <p className="mt-1 text-gray-700 text-sm">{post.text}</p>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditing && (
        <EditProfileModal
          user={userDetails}
          onSave={(updatedUser) => {
            setUserDetails(updatedUser);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* ================= MODAL IMAGE VIEW ================= */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Large"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
