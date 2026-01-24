import Header from "./Main_Components/Header/Header";
import Footer from "./Main_Components/Footer/Footer";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/authpage";
  const footerhide =
    location.pathname === "/profile" || location.pathname === "reels";
  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      {!footerhide && <Footer />}
    </div>
  );
}
