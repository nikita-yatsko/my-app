import { useLocation } from "react-router-dom";
import Navbar from "../pages/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4">{children}</div>
    </>
  );
}
