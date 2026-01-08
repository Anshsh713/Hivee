import Header from "./Main_Components/Header/Header";
import Footer from "./Main_Components/Footer/Footer";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/authpage";

  return (
    <div className="App-box">
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </div>
  );
}
