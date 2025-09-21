"use client";

import { useState } from "react";
import { useUploadThing } from "@uploadthing/next"; // UploadThing client
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
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // UploadThing hooks
  const { startUpload } = useUploadThing("imageAndVideo"); // must match backend router

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // File handling
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "profilePic") {
          setProfilePreview(reader.result);
          setProfileFile(file);
        }
        if (name === "coverImage") {
          setCoverPreview(reader.result);
          setCoverFile(file);
        }
      };
      reader.readAsDataURL(file);
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value || "" },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Upload files to UploadThing
      let profilePicUrl = profilePreview;
      let coverImageUrl = coverPreview;

      if (profileFile) {
        const res = await startUpload([profileFile]);
        if (res && res[0]) profilePicUrl = res[0].fileUrl;
      }
      if (coverFile) {
        const res = await startUpload([coverFile]);
        if (res && res[0]) coverImageUrl = res[0].fileUrl;
      }

      // Build JSON payload
      const payload = {
        name: formData.name,
        title: formData.title,
        phone: formData.phone,
        whatsappNo: formData.whatsappNo,
        skills: formData.skills,
        skillCategories: formData.skillCategories,
        location: formData.location,
        profilePic: profilePicUrl,
        coverImage: coverImageUrl,
      };

      // Send JSON to backend
      console.log(payload);
    //   const { data } = await axios.patch(`/api/user/${user._id}`, payload);

      onSave(data.user);
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium text-gray-700">Profile Picture</label>
        {profilePreview && (
          <img
            src={profilePreview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border mb-2"
          />
        )}
        <input
          type="file"
          name="profilePic"
          accept="image/*,video/*"
          onChange={handleChange}
          className="text-sm text-gray-500"
        />
      </div>

      {/* Cover Image */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium text-gray-700">Cover Image</label>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover"
            className="w-full h-32 rounded-lg object-cover border mb-2"
          />
        )}
        <input
          type="file"
          name="coverImage"
          accept="image/*,video/*"
          onChange={handleChange}
          className="text-sm text-gray-500"
        />
      </div>

      {/* Basic Info */}
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
      </div>

      {/* Skills & Categories */}
      <div className="grid grid-cols-1 gap-3">
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
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 gap-3">
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
