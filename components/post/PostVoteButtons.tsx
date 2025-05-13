"use client";

import { downvote } from "@/action/downvote";
import { upvote } from "@/action/upvote";
import {
  GetPostVotesQueryResult,
  GetUserPostVoteStatusQueryResult,
} from "@/sanity.types";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useState, useTransition } from "react";

function PostVoteButtons({
  contentId,
  votes,
  vote,
  contentType = "post",
}: {
  contentId: string;
  votes: GetPostVotesQueryResult;
  vote: GetUserPostVoteStatusQueryResult;
  contentType?: "post" | "comment";
}) {
  const { user, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();

  const [optimisticVote, setOptimisticVote] =
    useState<GetUserPostVoteStatusQueryResult>(vote);
  const [optimisticScore, setOptimisticScore] = useState<number>(
    votes.netScore
  );

  const handleUpvote = () => {
    if (!isSignedIn || isPending) return;

    let scoreChange = 0;
    if (optimisticVote === "upvote") {
      scoreChange = -1;
      setOptimisticVote(null);
    } else if (optimisticVote === "downvote") {
      scoreChange = 2;
      setOptimisticVote("upvote");
    } else {
      scoreChange = 1;
      setOptimisticVote("upvote");
    }
    setOptimisticScore((prev) => prev + scoreChange);
    startTransition(async () => {
      try {
        await upvote(contentId, contentType);
      } catch (error) {
        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error(`Failed to upvote ${contentType}:`, error);
      }
    });
  };

  const handleDownvote = () => {
    if (!isSignedIn || isPending) return;


    let scoreChange = 0;
    if (optimisticVote === "downvote") {
      scoreChange = 1;
      setOptimisticVote(null);
    } else if (optimisticVote === "upvote") {
      scoreChange = -2;
      setOptimisticVote("downvote");
    } else {
      scoreChange = -1;
      setOptimisticVote("downvote");
    }


    setOptimisticScore((prev) => prev + scoreChange);


    startTransition(async () => {
      try {
        await downvote(contentId, contentType);
      } catch (error) {

        setOptimisticVote(vote);
        setOptimisticScore(votes.netScore);
        console.error(`Failed to downvote ${contentType}:`, error);
      }
    });
  };
  
  return (
    <div className="flex flex-col items-center bg-gray-50 p-2 rounded-l-md">
      <button
        disabled={!isSignedIn || isPending || !user}
        onClick={handleUpvote}
        className={`p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
          optimisticVote === "upvote" ? "bg-orange-100" : "hover:bg-gray-100"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowUp
          className={`w-5 h-5 ${
            optimisticVote === "upvote"
              ? "text-orange-500 font-bold"
              : "text-gray-400 hover:text-orange-500"
          }`}
        />
      </button>

      <span className="text-sm font-medium text-gray-900">
        {optimisticScore}
      </span>

      <button
        disabled={!isSignedIn || isPending || !user}
        onClick={handleDownvote}
        className={`p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
          optimisticVote === "downvote" ? "bg-blue-100" : "hover:bg-gray-100"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ArrowDown
          className={`w-5 h-5 ${
            optimisticVote === "downvote"
              ? "text-blue-500 font-bold"
              : "text-gray-400 hover:text-blue-500"
          }`}
        />
      </button>
    </div>
  );
}

export default PostVoteButtons;
