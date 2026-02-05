import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Users from "./pages/user/Users";
import UserDetails from "./pages/user/UserDetails";
import RequireRole from "./auth/RequireRole";

import Items from "./pages/item/Items";
import AddItem from "./pages/item/AddItem";

import CartPage from "./pages/cart/CartPage";
import Layout from "./utils/Layout";
import AdminOrdersPage from "./pages/order/AdminOrdersPage";
import OrderDetailsPage from "./pages/order/OrderDetailsPage";
import PaymentsPage from "./pages/payment/PaymentsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route path="/users" element={ <RequireRole roles={["ADMIN"]}> <Users /> </RequireRole>}/>
          <Route path="/user/:id" element={ <RequireRole roles={["ADMIN"]}> <UserDetails /> </RequireRole> } />
          <Route path="/account" element={<RequireRole roles={["USER", "ADMIN"]}> <UserDetails /> </RequireRole>} />

          <Route path="/items" element={<RequireRole roles={["ADMIN", "USER"]}> <Items /> </RequireRole>} />
          <Route path="/items/add" element={ <RequireRole roles={["ADMIN"]}> <AddItem /> </RequireRole>} />

          <Route path="/orders" element={ <RequireRole roles={["ADMIN"]}> <AdminOrdersPage /> </RequireRole>} />
          <Route path="/order/:id" element={ <RequireRole roles={["ADMIN", "USER"]}> <OrderDetailsPage /> </RequireRole>} />

          <Route path="/payments" element={ <RequireRole roles={["ADMIN", "USER"]}> <PaymentsPage /> </RequireRole>} />

          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
