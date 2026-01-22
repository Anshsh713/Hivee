import React from "react";
import ReelCard from "../../Cards/ReelCard";
import "./Reels.css";
import { usePost } from "../../Context/PostingContext";

export default function Reels() {
  const { feedreels, loading } = usePost();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="Reels-Page">
      {console.log(feedreels)}
      {feedreels.map((reel) => (
        <ReelCard key={reel._id.toString()} reel={reel} />
      ))}
    </div>
  );
}
