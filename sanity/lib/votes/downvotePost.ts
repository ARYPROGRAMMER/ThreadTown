import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

export async function downvotePost(postId: string, userId: string) {
  const existingVoteDownvoteQuery = defineQuery(
    `*[_type == "vote" && post._ref == $postId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteDownvoteQuery,
    params: { postId, userId },
  });

  if (existingVote.data) {
    const vote = existingVote.data;

    if (vote.voteType === "downvote") {
      return await adminClient.delete(vote._id);
    }

    if (vote.voteType === "upvote") {
      return await adminClient
        .patch(vote._id)
        .set({ voteType: "downvote" })
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
    voteType: "downvote",
    createdAt: new Date().toISOString(),
  });
}
