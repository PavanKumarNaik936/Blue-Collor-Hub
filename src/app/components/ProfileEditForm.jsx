"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import axios from "axios";
export default function ProfileEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    title: user.title || "",
    phone: user.phone || "",
    whatsappNo: user.whatsappNo || "",
    skills: user.skills?.join(", ") || "",
    skillCategories: user.skillCategories?.join(", ") || "",
    location: {
      state: user.location?.state || "",
      district: user.location?.district || "",
      town: user.location?.town || "",
    },
  });

  const [profilePreview, setProfilePreview] = useState(user.profilePic || "");
  const [coverPreview, setCoverPreview] = useState(user.coverImage || "");
  const [profileUrl, setProfileUrl] = useState(user.profilePic || "");
  const [coverUrl, setCoverUrl] = useState(user.coverImage || "");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
        skillCategories: formData.skillCategories.split(",").map((s) => s.trim()),
        profilePic: profileUrl,
        coverImage: coverUrl,
      };
  
      // Call your API here
      const res = await axios.patch(`/api/user/${user._id}`, payload);
  
      alert("Profile updated successfully!");
      console.log("Updated user:", res.data);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium text-gray-700">Profile Picture</label>

        <img
          src={profilePreview || "/default-user.jpeg"}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border mb-2"
        />

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setProfileUrl(res[0].url);
              setProfilePreview(res[0].url);
              alert("Profile uploaded successfully!");
            }
          }}
          onUploadError={(err) => alert("Upload error: " + err.message)}
        >
          {profilePreview ? "Change Profile Image" : "Upload Profile Image"}
        </UploadButton>
      </div>

      {/* Cover Image Upload */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium text-gray-700">Cover Image</label>

        <img
          src={coverPreview || "/default-cover.jpeg"}
          alt="Cover"
          width={400}
          height={128}
          className="w-full h-32 rounded-lg object-cover border mb-2"
        />

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setCoverUrl(res[0].url);
              setCoverPreview(res[0].url);
              alert("Cover uploaded successfully!");
            }
          }}
          onUploadError={(err) => alert("Upload error: " + err.message)}
        >
          {coverPreview ? "Change Cover Image" : "Upload Cover Image"}
        </UploadButton>
      </div>

      {/* Other fields */}
      <div className="grid grid-cols-1 gap-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="title"
          placeholder="Professional Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="whatsappNo"
          placeholder="WhatsApp Number"
          value={formData.whatsappNo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="skillCategories"
          placeholder="Skill Categories (comma separated)"
          value={formData.skillCategories}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="location.state"
          placeholder="State"
          value={formData.location.state}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="location.district"
          placeholder="District"
          value={formData.location.district}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
        <input
          type="text"
          name="location.town"
          placeholder="Town"
          value={formData.location.town}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:ring focus:ring-indigo-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
