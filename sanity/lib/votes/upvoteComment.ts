import { defineQuery } from "next-sanity";
import { adminClient } from "../adminClient";
import { sanityFetch } from "../live";

export async function upvoteComment(commentId: string, userId: string) {
  const existingVoteUpvoteCommentQuery = defineQuery(
    `*[_type == "vote" && comment._ref == $commentId && user._ref == $userId][0]`
  );
  const existingVote = await sanityFetch({
    query: existingVoteUpvoteCommentQuery,
    params: { commentId, userId },
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
    comment: {
      _type: "reference",
      _ref: commentId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteType: "upvote",
    createdAt: new Date().toISOString(),
  });
}
