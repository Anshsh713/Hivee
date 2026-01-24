import React, { useState, useEffect } from "react";
import "./Profile.css";
import UserPost from "./Post-Section/Post";
import { usePost } from "../../Context/PostingContext";
import { useAuth } from "../../Context/UserContext";
import UserReel from "./Post-Section/Reels";

export default function Profile() {
  const [poststate, setPoststate] = useState("Post");
  const { userPosts, User_Post, loading } = usePost();
  const { user } = useAuth();
  const imagePosts = userPosts.filter((p) => p.Post_Type === "Image");
  const videoPosts = userPosts.filter((p) => p.Post_Type === "Video");
  const textPosts = userPosts.filter((p) => p.Post_Type === "Text");

  useEffect(() => {
    if (!user?._id) return;
    User_Post(user._id, 1);
  }, [user?._id]);

  if (!user) return null;

  return (
    <div className="profile-main-box">
      <div className="profile-banner">
        <img
          src="https://t3.ftcdn.net/jpg/07/32/10/90/360_F_732109080_4lXwGofazqAiysUpcCnrbflsNOl9EMdW.jpg"
          alt="Profile Banner"
          className="profile-banner-image"
        />

        <img
          src="https://t3.ftcdn.net/jpg/07/32/10/90/360_F_732109080_4lXwGofazqAiysUpcCnrbflsNOl9EMdW.jpg"
          className="blur"
          alt="blur"
        />
      </div>
      <div className="profile-section">
        <div className="profile-information">
          <div className="profile-image-section">
            <div className="profile-image">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrxWyi4x1lQylShWpP4lH7OmVft9lDsKDHbw&s"
                alt="Profile"
              />
            </div>
          </div>
          <div className="profile-details-section">
            <div className="Name">
              <h2>Display-Name</h2>
              <p>UserName</p>
              <i className="fa-solid fa-pen"></i>
            </div>
            <div className="following">
              <p>10 posts</p>
              <p>100 followers</p>
              <p>150 following</p>
            </div>
            <div className="bio">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                atque beatae distinctio quae laborum voluptatibus! Asperiores ut
                fugiat, dicta dolorum praesentium error, totam nesciunt pariatur
                quod nam similique perspiciatis cumque.
              </p>
            </div>
          </div>
        </div>
        <div className="profile-posts-section">
          <button
            onClick={() => {
              setPoststate("Post");
            }}
          >
            <i className="fa-solid fa-camera"></i>
          </button>
          <button
            onClick={() => {
              setPoststate("Thoughts");
            }}
          >
            <i className="fa-solid fa-comments"></i>
          </button>
          <button
            onClick={() => {
              setPoststate("Reels");
            }}
          >
            <i className="fa-solid fa-video"></i>
          </button>
        </div>
        <div className="user-post">
          {poststate === "Post" &&
            imagePosts.map((post) => <UserPost key={post._id} post={post} />)}
          {poststate === "Reels" &&
            videoPosts.map((post) => <UserReel key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
}
