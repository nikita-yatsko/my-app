import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <AuthProvider>
      <CartProvider> 
        <App /> 
      </CartProvider>
    </AuthProvider>
  // </React.StrictMode>
);
