"use client";

import Posts from "../components/Posts";
import Wishlist from "../components/Wishlist";
import ChatSupport from "../components/ChatSupport";
import Profile from "../components/Profile";

export default function DashboardPage() {
  return {
    posts: <Posts />,
    wishlist: <Wishlist />,
    chat: <ChatSupport />,
    profile: <Profile />,
  };
}
