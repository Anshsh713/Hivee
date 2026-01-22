import React from "react";
import ThoughtsCard from "../../Cards/Thoughtscard";
import { usePost } from "../../Context/PostingContext";
import "./Thoughts.css";

export default function Thoughts() {
  const { feedThoughts, fetchfeedThoughts, loading } = usePost();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="Home-Page">
      {feedThoughts.map((post) => (
        <ThoughtsCard key={post._id} post={post} />
      ))}
    </div>
  );
}
