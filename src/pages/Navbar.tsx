import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
        padding: "12px 24px"
      }}
    >
      <div className="container-fluid">

        {/* ЛОГО */}
        <Link
          to="/items"
          className="navbar-brand fw-bold text-white"
          style={{ fontSize: "1.4rem" }}
        >
          MyShop
        </Link>

        {/* КНОПКИ */}
        <div className="ms-auto d-flex gap-3">

          {user?.role === "ADMIN" && (
            <Link to="/users" className="btn btn-light fw-bold" style={{ color: "#4e54c8" }} >
              Users
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/orders" className="btn btn-light fw-bold" style={{ color: "#4e54c8" }} >
              Orders
            </Link>
          )}

          <Link
            to="/items"
            className="btn btn-light fw-bold"
            style={{ color: "#4e54c8" }}
          >
            Items
          </Link>

          <Link
            to="/payments"
            className="btn btn-light fw-bold"
            style={{ color: "#4e54c8" }}
          >
            Payments
          </Link>

          <Link
            to="/cart"
            className="btn btn-light fw-bold"
            style={{ color: "#4e54c8" }}
          >
            Cart
          </Link>

          <Link
            to="/account"
            className="btn btn-light fw-bold"
            style={{ color: "#4e54c8" }}
          >
            Account
          </Link>

        </div>
      </div>
    </nav>
  );
}
