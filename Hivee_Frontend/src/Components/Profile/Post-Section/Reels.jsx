import React from "react";
import "../Profile.css";
export default function UserReel({ post }) {
  const { _id, mediaURL, likesCount, commentsCount } = post;
  const like_comment_format = (value) => {
    if (value === 0) return `${""}`;
    if (value < 1000) return `${value}`;
    if (value < 1000000) return `${(value / 1000).toFixed(1)} K`;
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)} M`;
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  };
  return (
    <div className="posts">
      <div className="post-video">
        <video src={mediaURL} autoPlay loop playsInline muted />
      </div>
      <div className="post-information">
        <i className="fa-solid fa-heart"></i>
        <p>{like_comment_format(likesCount)}</p>
        <i className="fa-solid fa-comment"></i>
        <p>{like_comment_format(commentsCount)}</p>
      </div>
    </div>
  );
}
