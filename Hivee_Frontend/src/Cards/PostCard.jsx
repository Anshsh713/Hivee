import React, { useEffect, useRef, useState } from "react";
import "./Postcard.css";
import { createNextState } from "@reduxjs/toolkit";

export default function PostCard({ post }) {
  const {
    Caption,
    mediaURL,
    Post_Type,
    likesCount,
    commentsCount,
    createdAt,
    User,
  } = post;

  const videoRef = useRef(null);

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));

    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h`;
    return `${Math.floor(diff / 24)}d`;
  };

  useEffect(() => {
    if (Post_Type !== "Video" || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          videoRef.current.play();
          videoRef.current.muted = false;
        } else {
          videoRef.current.pause();
          videoRef.current.muted = true;
        }
      },
      { threshold: [0.6] },
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [Post_Type]);

  const like_comment_format = (value) => {
    if (value < 1000) return `${value}`;
    if (value < 1000000) return `${(value / 1000).toFixed(1)} K`;
    if (value < 1000000000) return `${(value / 1000000).toFixed(1)} M`;
    return `${(num / 1_000_000_000).toFixed(1)}B`;
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
          <video
            ref={videoRef}
            src={mediaURL}
            alt="post"
            loop
            muted
            playsInline
          />
        )}
        <div className="tags">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      <div className="interaction">
        <div className="like-comment-shar">
          <i className="fa-regular fa-heart"></i>
          <p>{like_comment_format(likesCount)}</p>
          <i className="fa-regular fa-comment fa-flip-horizontal"></i>
          <p>{like_comment_format(commentsCount)}</p>
          <i className="fa-regular fa-paper-plane"></i>
        </div>
        <div className="save">
          <i className="fa-regular fa-bookmark"></i>
        </div>
      </div>
      {Caption && (
        <div className="comment-user">
          <p>{User?.User_Name}</p>
          <p>{Caption}... </p>
          <p className="click">more</p>
        </div>
      )}
    </div>
  );
}
