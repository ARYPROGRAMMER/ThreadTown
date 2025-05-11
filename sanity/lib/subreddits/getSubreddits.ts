import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getSubreddits(){

    const getSubredditQuery = defineQuery(`*[_type == "subreddit"] {
        ...,
        "slug": slug.current,
        "moderator": moderator->,
        } | order(createdAt desc)`);

    const subreddits = await sanityFetch({
        query: getSubredditQuery
    });

    return subreddits.data;
}