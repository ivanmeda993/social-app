import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface PostStore {
  postId: Id<"posts"> | undefined;
  setPostId: (postId: Id<"posts"> | undefined) => void;
  onClose: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  postId: undefined,
  setPostId: (postId) => set({ postId }),
  onClose: () => set({ postId: undefined }),
}));
