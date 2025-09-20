"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">WorkConnect</h1>

      {session ? (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-lg">Welcome, <strong>{session.user.name}</strong></p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center">
          <p className="text-lg mb-2">Sign in to showcase or hire skilled workers</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Login with Email
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-yellow-400 text-black px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
