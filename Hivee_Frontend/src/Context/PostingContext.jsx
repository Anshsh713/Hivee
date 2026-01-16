import { createContext, use, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";

const PostContext = createContext();
export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

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
    <PostContext.Provider value={{ MakingPost, loading }}>
      {children}
    </PostContext.Provider>
  );
};
