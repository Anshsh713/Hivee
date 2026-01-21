import React, { useEffect, useRef, useState } from "react";
import { usePost } from "../Context/PostingContext";
import "./Postcard.css";

export default function PostCard({ post }) {
  const {
    _id,
    Caption,
    mediaURL,
    Post_Type,
    likesCount,
    commentsCount,
    createdAt,
    User,
    isLikedByMe = false,
    isSavedByMe = false,
  } = post;

  const videoRef = useRef(null);
  const { toggleLike, toggleSaved } = usePost();
  const [muted, setMuted] = useState(true);
  const CAPTION_WORD_LIMIT = 5;

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));

    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h`;
    return `${Math.floor(diff / 24)}d`;
  };

  useEffect(() => {
    if (Post_Type !== "Video" || !videoRef.current) return;

    const video = videoRef.current;

    // ✅ MUST be muted before autoplay
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0.6] },
    );

    observer.observe(video);

    // ✅ IMPORTANT: force check once after mount
    setTimeout(() => {
      const rect = video.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibilityRatio = visibleHeight / rect.height;

      if (visibilityRatio >= 0.6) {
        video.play().catch(() => {});
      }
    }, 100);

    return () => observer.disconnect();
  }, [Post_Type]);

  const togglemute = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const like_comment_format = (value) => {
    if (value === 0) return `${""}`;
    if (value < 1000) return `${value}`;
    if (value < 1000000) return `${(value / 1000).toFixed(1)} K`;
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)} M`;
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  };

  const limitCaption = (text, limit = CAPTION_WORD_LIMIT) => {
    if (!text) return;
    const words = text.trim().split(/\s+/);
    return words.slice(0, limit).join(" ");
  };

  return (
    <div className="card-main-box">
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
      <div className="post">
        {Post_Type === "Image" && <img src={mediaURL} alt="post" />}
        {Post_Type === "Video" && (
          <video ref={videoRef} src={mediaURL} alt="post" loop playsInline />
        )}
        <div className="tag-users">
          <i className="fa-solid fa-user"></i>
        </div>
        {Post_Type === "Video" && (
          <div className="mute-toggle" onClick={togglemute}>
            <i
              className={
                muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high"
              }
            ></i>
          </div>
        )}
      </div>
      <div className="interaction">
        <div className="like-comment-shar">
          <i
            className={
              isLikedByMe ? "fa-solid fa-heart liked" : "fa-regular fa-heart"
            }
            onClick={() => toggleLike(_id)}
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
            onClick={() => toggleSaved(_id)}
          ></i>
        </div>
      </div>
      {Caption && (
        <div className="comment-user">
          <p>{User?.User_Name}</p>
          <p>{limitCaption(Caption)} ... </p>
          <p className="click"> more</p>
        </div>
      )}
    </div>
  );
}
