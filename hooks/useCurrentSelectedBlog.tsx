import { BlogType } from "@/lib/types";
import { create } from "zustand";

export const useCurrentSelectedBlog = create<{
  currentSelectedBlog: BlogType | null;
  setCurrentSelectedBlog: (blog: BlogType | null) => void;
}>((set) => ({
  currentSelectedBlog: null,
  setCurrentSelectedBlog: (blog) =>
    set({ currentSelectedBlog: blog }),
}));
