import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import RequireRole from "./auth/RequireRole";

import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1>Profile page</h1>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/users")}
        >
        Go to Users
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/users" element={ <RequireRole role="ADMIN"> <Users /> </RequireRole>}/>
        <Route path="/user/:id" element={<UserDetails />} />


        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
