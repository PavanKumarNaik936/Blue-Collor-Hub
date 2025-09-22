"use client";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";

import { useState } from "react";
import { FiCamera } from "react-icons/fi";

export default function EditProfileModal({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    mobile: user.mobile || "",
    skillCategory: user.skillCategory || "",
    skill: user.skill || "",
    state: user.state || "",
    city: user.city || "",
    profilePic: user.profilePic || "",
    coverImage: user.coverImage || "",
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
    }
  };

  const handleSave = () => {
    onSave(formData);
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
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  </div>
</div>


        {/* Profile Picture */}
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
          alert(`Upload failed: ${error.message}`);
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
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            placeholder="Bio"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            placeholder="Mobile"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="skillCategory"
            value={formData.skillCategory}
            onChange={(e) =>
              setFormData({ ...formData, skillCategory: e.target.value })
            }
            placeholder="Skill Category"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="skill"
            value={formData.skill}
            onChange={(e) =>
              setFormData({ ...formData, skill: e.target.value })
            }
            placeholder="Skill"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            placeholder="State"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="City"
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
            className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
