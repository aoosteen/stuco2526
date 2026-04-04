import { useEffect } from "react";

export default function TitleManager() {
  useEffect(() => {
    let originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Capture current title before switching
        originalTitle = document.title;
        document.title = "Hey!, We miss u :(";
      } else {
        // Restore title when user returns
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}