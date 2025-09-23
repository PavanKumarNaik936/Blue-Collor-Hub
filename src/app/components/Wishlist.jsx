"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PostCard from "./PostCard";

export default function Wishlist() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("/api/user/wishlist");

        // Filter out null posts in case populate failed or post deleted
        const validPosts = Array.isArray(data) ? data.filter(Boolean) : [];
        setPosts(validPosts);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [refreshKey]);
  const handleToggle = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) return <p>Loading wishlist...</p>;

  if (!posts.length) return <p>No posts in your wishlist.</p>;

  return (
    <div className="p-4 space-y-4">
      {posts.map((post) =>
        post ? <PostCard key={post._id} post={post} onToggle={handleToggle}/> : null
      )}
    </div>
  );
}
