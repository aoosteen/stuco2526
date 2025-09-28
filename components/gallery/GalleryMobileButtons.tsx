"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const GalleryMobileButtons = ({
  term,
  termNumWord,
}: {
  term: string;
  termNumWord: string;
}) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Update active ID when hash changes
    const handleHashChange = () => {
      setActiveId(window.location.hash.slice(1)); // Remove the # from the hash
    };

    // Set initial active ID
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const termId = "term" + termNumWord;
  const isActive = activeId === termId;

  return (
    <Link
      href={`/gallery#${termId}`}
      key={term}
    >
      <Button
        key={term}
        variant={"yellowOutline"}
        className={cn(
          "cursor-pointer",
          isActive && "bg-yellow-800 text-[var(--main-bg)] hover:bg-yellow-800/90"
        )}
      >
        {term.replace("term", "Term ")}
      </Button>
    </Link>
  );
};

export default GalleryMobileButtons;