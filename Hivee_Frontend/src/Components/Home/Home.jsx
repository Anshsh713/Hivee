import React from "react";
import PostCard from "../../Cards/PostCard";
import "../../Cards/PostCard.css";
import { usePost } from "../../Context/PostingContext";

export default function Home() {
  const { feed, fetchfeed, loading } = usePost();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="Home-Page">
      {feed.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
