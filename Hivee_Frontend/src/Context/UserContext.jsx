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
    const res = await fetch("http://localhost:5000/user/signup-request", {
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

    return true;
  };

  const signupUser_by_verify = async (name, email, password, otp) => {
    const res = await fetch("http://localhost:5000/user/signup-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        User_Name: name,
        User_Email: email,
        User_Password: password,
        otp,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return true;
  };

  const Password_Reset_requesting = async (email) => {
    const res = await fetch(
      "http://localhost:5000/user/password-Reset-requesting",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          User_Email: email,
        }),
      }
    );

    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return true;
  };

  const Password_Reset_Verify = async (email, otp) => {
    const res = await fetch(
      "http://localhost:5000/user/password-Reset-Verifying",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          User_Email: email,
          otp: otp,
        }),
      }
    );

    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return true;
  };

  const Password_Reseting = async (email, password) => {
    const res = await fetch("http://localhost:5000/user/password-Reseting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        User_Email: email,
        newPassword: password,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return true;
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
        signupUser_by_verify,
        Password_Reset_requesting,
        Password_Reset_Verify,
        Password_Reseting,
        logoutUser: () => dispatch(logout()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
