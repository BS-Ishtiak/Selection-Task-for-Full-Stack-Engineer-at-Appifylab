"use client";
import React from "react";
import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import StoryCarousel from "../../components/StoryCarousel";
import PostComposer from "../../components/PostComposer";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../context/AuthContext";
import MobileBottomNav from "../../components/MobileBottomNav";
import ThemeToggle from "../../components/ThemeToggle";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function FeedPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, isAuthReady } = useAuth();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthReady) return; // wait until auth initialization completes
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get("/api/posts");
        const payload = res.data;
        if (payload?.success && Array.isArray(payload.data)) {
          const mapped = payload.data.map((p: any) => {
            const authorName = (user && (user.fullName || user.name || `${user.firstName || user.fname || ''} ${user.lastName || user.lname || ''}`.trim())) || 'You';
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const image = p?.image_url
              ? (p.image_url.startsWith('http')
                  ? p.image_url
                  : apiBase.replace(/\/$/, '') + (p.image_url.startsWith('/') ? p.image_url : ('/' + p.image_url)))
              : undefined;
            const time = p?.created_at ? new Date(p.created_at).toLocaleString() : undefined;
            return { id: p.id || Date.now(), author: authorName, time, title: p.text, image };
          });
          if (!cancelled) setPosts(mapped);
        }
      } catch (e) {
        // ignore for now; feed will simply be empty
        console.error("Failed to load posts", e);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user, isAuthReady]);

  const handleNewPost = (p: any) => {
    // Map backend post shape to PostCard props
    const authorName = (user && (user.fullName || user.name || `${user.firstName || user.fname || ''} ${user.lastName || user.lname || ''}`.trim())) || 'You';
    const image = p?.image_url
      ? (p.image_url.startsWith('http')
          ? p.image_url
          : apiBase.replace(/\/$/, '') + (p.image_url.startsWith('/') ? p.image_url : ('/' + p.image_url)))
      : undefined;
    const time = p?.created_at ? new Date(p.created_at).toLocaleString() : undefined;
    const newItem = { id: p?.id || Date.now(), author: authorName, time, title: p?.text, image };
    setPosts((s) => [newItem, ...s]);
  };

  return (
    <ProtectedRoute>
      <div className={`_layout _layout_main_wrapper${darkMode ? " _dark_wrapper" : ""}`}>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <Header />
      <div className="_main_layout">
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <main className="_layout_middle_wrap">
                  <StoryCarousel />
                  <PostComposer onCreated={handleNewPost} />
                  {posts.map((pt) => (
                    <PostCard key={pt.id} postId={pt.id} author={pt.author} time={pt.time} title={pt.title} image={pt.image} />
                  ))}
                </main>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
    </ProtectedRoute>
  );
}
