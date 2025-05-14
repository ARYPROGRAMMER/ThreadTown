"use server";

import { adminClient } from "@/sanity/lib/adminClient";
import { getPostById } from "@/sanity/lib/post/getPostById";
import { currentUser } from "@clerk/nextjs/server";

export const deletePost = async (postId: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "User not found" };
  }

  const post = await getPostById(postId);
  if (!post) {
    return { error: "Post not found" };
  }

  console.log(post);
  console.log(post.author?._id, user?.id);

  if (post.author?._id !== user?.id) {
    return { error: "You are not authorized to delete this post" };
  }

  const patch = adminClient.patch(postId);

  if (post.image?.asset?._ref) {
    patch.set({ image: null });
  }

  patch.set({ isDeleted: true });

  patch.set({
    body: [{ children: [{ text: "[DELETED CONTENTS]" }], type: "paragraph" }],
  });

  patch.set({ title: "[DELETED POST]" });

  const result = await patch.commit();

  if (result) {

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleting image from post");
    if (post.image?.asset?._ref) {
      await adminClient.delete(post.image.asset._ref);
    }
  }
  return { success: "Post deleted successfully" };
};