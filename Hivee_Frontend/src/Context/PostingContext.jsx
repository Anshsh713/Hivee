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

  return (
    <PostContext.Provider
      value={{ feed, fetchfeed, MakingPost, loading, hasMore }}
    >
      {children}
    </PostContext.Provider>
  );
};
