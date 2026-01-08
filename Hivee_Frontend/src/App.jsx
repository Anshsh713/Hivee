import Header from "./Main_Components/Header/Header";
import Footer from "./Main_Components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const hideLayout = location.pathname === "/authpage";

  return (
    <div>
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </div>
  );
}
