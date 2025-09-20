"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.skills = data.skills ? data.skills.split(",").map((s) => s.trim()) : [];

    try {
      await axios.post("/api/auth/signup", data);
      toast.success("Registration successful! Logging you in...");

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Showcase your skills or hire skilled workers
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" required className="input" />
          <input type="email" name="email" placeholder="Email" required className="input" />
          <input type="password" name="password" placeholder="Password" required className="input" />
          <input type="text" name="skills" placeholder="Skills (comma separated)" className="input" />
          <input type="text" name="location" placeholder="Location" className="input" />
          <textarea name="bio" placeholder="Short Bio" rows={3} className="input" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 mt-2 transition-colors duration-300">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => router.push("/login")}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
