"use client";

import { useEffect } from "react";

export default function TitleManager() {
  useEffect(() => {
    const originalTitle = "JNY Student Council";

    const handleVisibilityChange = () => {
      document.title = document.hidden 
        ? "Hey!, We miss u :(" 
        : originalTitle;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}