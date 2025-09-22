"use client";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function EditProfileModal({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    title: user.title || "",
    phone: user.phone || "",
    skillCategories: user.skillCategories || [],
    skills: user.skills || [],
    state: user.state || "",
    town: user.town || "",
    profilePic: user.profilePic || "",
    coverImage: user.coverImage || "",
  });

  const [saving, setSaving] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skillCategories" || name === "skills") {
      setFormData({ ...formData, [name]: value.split(",").map((v) => v.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        title: formData.title,
        phone: formData.phone,
        skillCategories: formData.skillCategories,
        skills: formData.skills,
        state: formData.state,
        town: formData.town,
        profilePic: formData.profilePic,
        coverImage: formData.coverImage,
      };

      const { data } = await axios.patch(`/api/user/${user._id}`, payload);
      onSave(data.user || payload);

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Error updating profile. Try again!");
    } finally {
      setSaving(false);
    }
  };

  // Render array values as tags
  const renderTags = (arr, color = "blue") => {
    if (!Array.isArray(arr) || arr.length === 0)
      return <span className="text-gray-500">N/A</span>;

    const bg = color === "blue" ? "bg-blue-100" : "bg-green-100";
    const text = color === "blue" ? "text-blue-800" : "text-green-800";

    return (
      <div className="inline-flex flex-wrap gap-2 mt-1">
        {arr.map((item, idx) => (
          <span key={idx} className={`${bg} ${text} text-sm px-2 py-1 rounded-full`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-3xl p-8 rounded-lg mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        {/* Cover Image */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Cover Image</label>
          <div className="relative">
            <img
              src={formData.coverImage || "/cover.jpg"}
              alt="Cover"
              className="w-full h-40 object-cover rounded border"
            />
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setFormData((prev) => ({ ...prev, coverImage: res[0].url }));
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Profile Picture</label>
          <div className="relative w-32 h-32">
            <img
              src={formData.profilePic || "/profile.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setFormData((prev) => ({ ...prev, profilePic: res[0].url }));
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            </div>
          </div>
        </div>

        {/* Other Fields */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="skillCategories"
            value={formData.skillCategories.join(", ")}
            onChange={handleChange}
            placeholder="Skill Categories (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
          <div>
            <span className="font-semibold">Preview Skill Categories:</span>
            {renderTags(formData.skillCategories, "blue")}
          </div>

          <input
            type="text"
            name="skills"
            value={formData.skills.join(", ")}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
          <div>
            <span className="font-semibold">Preview Skills:</span>
            {renderTags(formData.skills, "green")}
          </div>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleChange}
            placeholder="Town"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 rounded bg-black text-white ${
              saving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
