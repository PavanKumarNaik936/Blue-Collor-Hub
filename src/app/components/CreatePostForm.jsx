"use client";

import { useState } from "react";
// import { uploadFiles } from "@/lib/uploadthing"; // Uncomment when using UploadThing

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image"); 
  const [files, setFiles] = useState([]); // multiple files
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || files.length === 0) {
      alert("Title, description, and file(s) are required!");
      return;
    }

    setLoading(true);

    try {
      // const uploaded = await uploadFiles(files, mediaType);
      // const mediaStrings = uploaded;

      const mediaStrings = files.map(() => "dummy-string-for-now"); // dummy logic

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          images: mediaType === "image" ? mediaStrings : [],
          video: mediaType === "video" ? mediaStrings[0] : null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Post created successfully!");
        setTitle("");
        setDescription("");
        setFiles([]);
        setMediaType("image");
      } else {
        alert(data.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Server error while creating post.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (mediaType === "image") {
      setFiles(Array.from(e.target.files));
    } else {
      setFiles(e.target.files[0] ? [e.target.files[0]] : []);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Create New Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black transition"
          required
        />

        <select
          value={mediaType}
          onChange={(e) => {
            setMediaType(e.target.value);
            setFiles([]); // reset files on type change
          }}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        <input
          type="file"
          accept={mediaType === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          multiple={mediaType === "image"} // allow multiple images
          className="p-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-black transition"
          required
        />

        {/* Display selected files */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm gap-2"
              >
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
