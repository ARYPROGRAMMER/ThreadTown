import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

export async function upvotePost(postId: string, userId: string) {
  const existingVoteUpvoteQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteUpvoteQuery,
    params: { postId, userId },
  });

  if (existingVote.data) {
    const vote = existingVote.data;
    if (vote.voteType === "upvote") {
      return await adminClient.delete(vote._id);
    }
    if (vote.voteType === "downvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "upvote" })
        .commit();
    }
  }

  return await adminClient.create({
    _type: "vote",
    post: {
      _type: "reference",
      _ref: postId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}