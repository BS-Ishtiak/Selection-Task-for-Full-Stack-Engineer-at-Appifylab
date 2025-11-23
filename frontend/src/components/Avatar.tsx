"use client";
import React from "react";

type AvatarProps = {
  src?: string;
  alt?: string;
  className?: string;
  status?: "online" | "offline" | null;
};

export default function Avatar({ src = "/assets/images/profile.png", alt = "Avatar", className = "", status = null }: AvatarProps) {
  return (
    <div className={"_avatar " + className}>
      <img src={src} alt={alt} className="_avatar_img" />
      {status === "online" && (
        <span className="_avatar_status" aria-hidden />
      )}
    </div>
  );
}
