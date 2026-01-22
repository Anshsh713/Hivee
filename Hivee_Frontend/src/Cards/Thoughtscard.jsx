import React from "react";
import { usePost } from "../Context/PostingContext";
import "./Postcard.css";

export default function ThoughtsCard({ post }) {
  const {
    _id,
    Caption,
    likesCount,
    commentsCount,
    createdAt,
    User,
    isLikedByMe = false,
    isSavedByMe = false,
  } = post;

  const { toggleLike, toggleSaved } = usePost();

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));

    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h`;
    return `${Math.floor(diff / 24)}d`;
  };

  const like_comment_format = (value) => {
    if (value === 0) return `${""}`;
    if (value < 1000) return `${value}`;
    if (value < 1000000) return `${(value / 1000).toFixed(1)} K`;
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)} M`;
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  };

  return (
    <div className="Thought-main-box">
      <div className="user-post-information">
        <div className="information">
          <div className="profile">
            <i className="fa-regular fa-circle-user"></i>
          </div>
          <div className="user">
            <h1>{User?.User_Name}</h1>
            <i className="fa-solid fa-circle"></i>
            <p>{getTimeAgo(createdAt)}</p>
          </div>
        </div>
        <div className="more">
          <i className="fa-solid fa-ellipsis"></i>
        </div>
      </div>
      <div className="Caption">
        <p>{Caption}</p>
      </div>
      <div className="interaction">
        <div className="like-comment-shar">
          <i
            className={
              isLikedByMe ? "fa-solid fa-heart liked" : "fa-regular fa-heart"
            }
            onClick={() => toggleLike(_id, "text")}
          ></i>

          <p>{like_comment_format(likesCount)}</p>
          <i className="fa-regular fa-comment fa-flip-horizontal"></i>
          <p>{like_comment_format(commentsCount)}</p>
          <i className="fa-regular fa-paper-plane"></i>
        </div>
        <div className="save">
          <i
            className={
              isSavedByMe
                ? "fa-solid fa-bookmark Saved"
                : "fa-regular fa-bookmark"
            }
            onClick={() => toggleSaved(_id, "text")}
          ></i>
        </div>
      </div>
    </div>
  );
}
