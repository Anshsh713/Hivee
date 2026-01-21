import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";

const PostContext = createContext();
export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (token) fetchfeed(1);
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

  const MakingPost = async (postData, isMultipart = false) => {
    if (!isAuthenticated) {
      throw new Error("User not Authenticated");
    }

    try {
      setLoading(true);

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

      return data.posting;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!token) return;

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
      setFeed((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLikedByMe: !post.isLikedByMe,
                likesCount: post.isLikedByMe
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post,
        ),
      );
    }
  };

  const toggleSaved = async (postId) => {
    if (!token) return;

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
    }
  };

  return (
    <PostContext.Provider
      value={{
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
