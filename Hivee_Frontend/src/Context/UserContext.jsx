import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../Data_Management/AuthSlice";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { status, Hivee_User, token } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          dispatch(login({ Hivee_User: data.user, token: storedToken }));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  const loginUser = async (email, password) => {
    const res = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        User_Email: email,
        User_Password: password,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    dispatch(login({ Hivee_User: data.Hiveeuser, token: data.token }));
  };

  const signupUser = async (name, email, password) => {
    const res = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        User_Name: name,
        User_Email: email,
        User_Password: password,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    await loginUser(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: status,
        user: Hivee_User,
        token,
        loading,
        loginUser,
        signupUser,
        logoutUser: () => dispatch(logout()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
