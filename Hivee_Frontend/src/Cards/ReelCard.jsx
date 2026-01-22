import React, { useEffect, useRef, useState } from "react";
import { usePost } from "../Context/PostingContext";
import "./ReelCard.css";

export default function ReelCard({ reel }) {
  const {
    _id,
    Caption,
    mediaURL,
    likesCount,
    commentsCount,
    createdAt,
    User,
    isLikedByMe = false,
    isSavedByMe = false,
  } = reel;

  const videoRef = useRef(null);
  const { toggleLike, toggleSaved, reelMuted, setReelMuted } = usePost();

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.muted = reelMuted;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.75) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0.75] },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [reelMuted]);

  const toggleMute = () => {
    setReelMuted(!reelMuted);
  };

  const formatCount = (value) => {
    if (!value) return "";
    if (value < 1000) return value;
    if (value < 1_000_000) return `${(value / 1000).toFixed(1)}K`;
    return `${(value / 1_000_000).toFixed(1)}M`;
  };

  return (
    <div className="reels">
      <div className="reel-section">
        <video
          ref={videoRef}
          src={mediaURL}
          loop
          playsInline
          className="reel-video"
        />
        <div className="reel-mute" onClick={toggleMute}>
          <i
            className={
              reelMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high"
            }
          />
        </div>
        <div className="reel-info">
          <div className="reel-user">
            <i className="fa-regular fa-circle-user"></i>
            <p>{User?.User_Name}</p>
            <button>Follow</button>
          </div>

          {Caption && <p className="reel-caption">{Caption} ....</p>}
        </div>
      </div>
      <div className="reel-actions">
        <div className="action">
          <i
            className={
              isLikedByMe ? "fa-solid fa-heart liked" : "fa-regular fa-heart"
            }
            onClick={() => toggleLike(_id, "reel")}
          ></i>
          <p>{formatCount(likesCount)}</p>
        </div>

        <div className="action">
          <i className="fa-regular fa-comment"></i>
          <p>{formatCount(commentsCount)}</p>
        </div>

        <div className="action">
          <i className="fa-regular fa-paper-plane"></i>
        </div>

        <div className="action">
          <i
            className={
              isSavedByMe
                ? "fa-solid fa-bookmark Saved"
                : "fa-regular fa-bookmark"
            }
            onClick={() => toggleSaved(_id, "reel")}
          ></i>
        </div>
        <div className="more">
          <i className="fa-solid fa-ellipsis"></i>
        </div>
      </div>
    </div>
  );
}
