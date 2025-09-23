"use client";

import { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegHeart, FaComment, FaStar } from "react-icons/fa";

export default function PostCard() {
  const post = {
    username: "vikas_yeddula",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    bio: "Web Developer & Tech Enthusiast",
    images: [
      "https://picsum.photos/800/500",
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?cs=srgb&dl=pexels-asadphoto-457882.jpg&fm=jpg",
      "https://picsum.photos/802/500",
    ],
    likes: 120,
    comments: [
      { name: "Alice", commentMsg: "Great post!", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Bob", commentMsg: "Amazing work 😍", avatar: "https://i.pravatar.cc/150?img=6" },
      { name: "Charlie", commentMsg: "Loved it!", avatar: "https://i.pravatar.cc/150?img=7" },
      { name: "David", commentMsg: "Awesome!", avatar: "https://i.pravatar.cc/150?img=8" },
    ],
    rating: 4,
    feedbacks: [
      { name: "Alice", message: "Amazing post!", stars: 5 },
      { name: "Bob", message: "Loved it 😍", stars: 4 },
    ],
  };

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [feedbacks, setFeedbacks] = useState(post.feedbacks);
  const [newComment, setNewComment] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const commentsRef = useRef(null);
  const ratingsRef = useRef(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const commentObj = {
      name: "You",
      commentMsg: newComment,
      avatar: "https://i.pravatar.cc/150?img=12",
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  const handleAddFeedback = () => {
    if (newFeedback.trim() === "" || newRating === 0) return;
    const feedbackObj = {
      name: "You",
      message: newFeedback,
      stars: newRating,
    };
    setFeedbacks([feedbackObj, ...feedbacks]);
    setNewFeedback("");
    setNewRating(0);
  };

  // Close comments or ratings if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentsRef.current && !commentsRef.current.contains(e.target)) {
        setShowComments(false);
      }
      if (ratingsRef.current && !ratingsRef.current.contains(e.target)) {
        setShowRatings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-6 border shadow-md bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.userAvatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{post.username}</p>
            <p className="text-gray-500 text-sm">{post.bio}</p>
          </div>
        </div>
        <button className="px-4 py-1 text-blue-500 font-semibold border border-blue-500 rounded-md hover:bg-blue-50 transition">
          Follow
        </button>
      </div>

      {/* Post Image Slider */}
      <div className="relative w-full aspect-[16/9] bg-gray-200">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={post.images[currentImage]}
          alt="Post"
          className={`w-full h-full object-cover ${imageLoading ? "hidden" : "block"}`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        {post.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {post.images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => {
                  setCurrentImage(idx);
                  setImageLoading(true);
                }}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  idx === currentImage ? "bg-white" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Actions & Rating Layout */}
      <div className="flex justify-between items-center px-4 py-4 border-t border-gray-200">
        {/* Left: Like & Comment */}
        <div className="flex gap-6">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
            {liked ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-2xl" />
            )}
            <span className="text-gray-600 text-sm mt-1">{likesCount} likes</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowComments(true)}>
            <FaComment className="text-2xl" />
            <span className="text-gray-600 text-sm mt-1">{comments.length} comments</span>
          </div>
        </div>

        {/* Right: Rating */}
        <div className="flex flex-col items-center cursor-pointer" onClick={() => setShowRatings(!showRatings)}>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={i < post.rating ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm mt-1">View Ratings</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div ref={commentsRef} className="border-t border-gray-200 p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Post
            </button>
          </div>
          <div className="space-y-3 max-h-48 overflow-auto">
            {comments.map((c, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-gray-100 p-2 rounded-lg w-full">
                  <span className="font-semibold">{c.name}:</span>{" "}
                  <span>{c.commentMsg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratings / Feedback Section */}
      {showRatings && (
        <div ref={ratingsRef} className="border-t border-gray-200 p-4">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span>Rate this post:</span>
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`text-2xl cursor-pointer ${i < newRating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setNewRating(i + 1)}
                />
              ))}
            </div>
            <textarea
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="Write your feedback..."
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition self-start"
              onClick={handleAddFeedback}
            >
              Submit
            </button>
          </div>
          <div className="space-y-3 max-h-48 overflow-auto">
            {feedbacks.map((f, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} className={i < f.stars ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="font-semibold">{f.name}</span>
                </div>
                <p className="bg-gray-100 p-2 rounded-lg">{f.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
