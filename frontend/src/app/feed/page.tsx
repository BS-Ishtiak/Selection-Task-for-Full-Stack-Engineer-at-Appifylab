"use client";
import React, { useEffect } from "react";
import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import StoryCarousel from "../../components/StoryCarousel";
import PostComposer from "../../components/PostComposer";
import PostCard from "../../components/PostCard";
import MobileBottomNav from "../../components/MobileBottomNav";
import ThemeToggle from "../../components/ThemeToggle";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Client-side guard: if no accessToken in localStorage, redirect to login
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.replace('/login');
      }
    }
  }, [router]);

  return (
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
                  <PostComposer />
                  <PostCard />
                  <PostCard author="Another Author" title="-Another Post" />
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
  );
}
