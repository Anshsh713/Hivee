import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";

const PostContext = createContext();
export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState([]);
  const [feedThoughts, setFeedThoughts] = useState([]);
  const [feedreels, setFeedReels] = useState([]);
  const [page, setPage] = useState(1);
  const [thoughtsPage, setThoughtsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reelMuted, setReelMuted] = useState(true);
  const [postMuted, setPostMuted] = useState(true);

  useEffect(() => {
    if (token) {
      fetchfeed(1);
      fetchfeedThoughts(1);
      fetchfeedReels(1);
    }
  }, [token]);

  const fetchfeed = async (pageNumber = 1) => {
    if (!token) return;
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/post/feed?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFeed((prev) =>
        pageNumber === 1 ? data.posts : [...prev, ...data.posts],
      );
      setHasMore(data.hasMore);
      setPage(pageNumber);
    } catch {
      console.error("FEED ERROR : ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchfeedThoughts = async (pageNumber = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/post/thoughts-feed?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFeedThoughts((prev) =>
        pageNumber === 1 ? data.posts : [...prev, ...data.posts],
      );
      setHasMore(data.hasMore);
      setThoughtsPage(pageNumber);
    } catch (error) {
      console.error("FEED ERROR : ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchfeedReels = async (pageNumber = 1) => {
    if (!token) return;
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/post/reels-feed?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setFeedReels((prev) =>
        pageNumber === 1 ? data.posts : [...prev, ...data.posts],
      );
      setHasMore(data.hasMore);
      setPage(pageNumber);
    } catch (error) {
      console.error("FEED ERROR : ", error);
    } finally {
      setLoading(false);
    }
  };

  const MakingPost = async (postData, isMultipart = false) => {
    console.log("Making Post Called", postData);
    if (!isAuthenticated) {
      throw new Error("User not Authenticated");
    }

    try {
      const res = await fetch("http://localhost:5000/post/making-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isMultipart ? {} : { "Content-Type": "application/json" }),
        },
        body: isMultipart ? postData : JSON.stringify(postData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (postData.Post_Type === "Text") {
        setFeedThoughts((prev) => [data.posting, ...prev]);
      } else if (
        postData.Post_Type === "Video" ||
        postData.Post_Type === "Image"
      ) {
        setFeed((prev) => [data.posting, ...prev]);
      }

      return data.posting;
    } catch (error) {
      console.error("Error in making post: ", error);
      throw error;
    }
  };

  const like_save_refresh = async (type, typeofpost, postId) => {
    if (type === "like") {
      if (typeofpost === "post") {
        setFeed((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post,
          ),
        );
        setFeedReels((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post,
          ),
        );
      } else if (typeofpost === "text") {
        setFeedThoughts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post,
          ),
        );
      } else if (typeofpost === "reel") {
        setFeedReels((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post,
          ),
        );
        setFeed((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isLikedByMe: !post.isLikedByMe,
                  likesCount: post.isLikedByMe
                    ? post.likesCount - 1
                    : post.likesCount + 1,
                }
              : post,
          ),
        );
      } else {
        return;
      }
    } else if (type === "save") {
      if (typeofpost === "post") {
        setFeed((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isSavedByMe: !post.isSavedByMe,
                  SavedCount: post.isSavedByMe
                    ? post.SavedCount - 1
                    : post.SavedCount + 1,
                }
              : post,
          ),
        );
        setFeedReels((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isSavedByMe: !post.isSavedByMe,
                  SavedCount: post.isSavedByMe
                    ? post.SavedCount - 1
                    : post.SavedCount + 1,
                }
              : post,
          ),
        );
      } else if (typeofpost === "text") {
        setFeedThoughts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isSavedByMe: !post.isSavedByMe,
                  SavedCount: post.isSavedByMe
                    ? post.SavedCount - 1
                    : post.SavedCount + 1,
                }
              : post,
          ),
        );
      } else if (typeofpost === "reel") {
        setFeedReels((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isSavedByMe: !post.isSavedByMe,
                  SavedCount: post.isSavedByMe
                    ? post.SavedCount - 1
                    : post.SavedCount + 1,
                }
              : post,
          ),
        );
        setFeed((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  isSavedByMe: !post.isSavedByMe,
                  SavedCount: post.isSavedByMe
                    ? post.SavedCount - 1
                    : post.SavedCount + 1,
                }
              : post,
          ),
        );
      } else {
        return;
      }
    }
  };

  const toggleLike = async (postId, type) => {
    if (!token) return;
    await like_save_refresh("like", type, postId);
    try {
      const res = await fetch(`http://localhost:5000/post/likes/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error("Like failed");
      }
    } catch (error) {
      await like_save_refresh("like", type, postId);
    }
  };

  const toggleSaved = async (postId, type) => {
    if (!token) return;
    await like_save_refresh("save", type, postId);
    try {
      const res = await fetch(`http://localhost:5000/post/saves/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error("Save failed");
      }
    } catch (error) {
      await like_save_refresh("save", type, postId);
    }
  };

  return (
    <PostContext.Provider
      value={{
        postMuted,
        setPostMuted,
        reelMuted,
        setReelMuted,
        feedreels,
        fetchfeedReels,
        feedThoughts,
        fetchfeedThoughts,
        toggleSaved,
        toggleLike,
        feed,
        fetchfeed,
        MakingPost,
        loading,
        hasMore,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
