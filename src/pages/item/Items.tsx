import { useEffect, useState } from "react";
import { extractErrorMessage } from "../../utils/errorUtils";
import { getAllItems } from "../../api/itemApi";
import { Item } from "../../types/item.dto";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { deleteItem } from "../../api/itemApi";
import { useCart } from "../../cart/CartContext";

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const role = authUser?.role;

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllItems();
      setItems(data);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDeleteItem= async (itemId: number) => {
      try {
        await deleteItem(itemId);
        setItems(prev => prev.filter(c => c.id !== itemId));
      } catch (e: any) {
        setError(extractErrorMessage(e));
      }
    };

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Items</h2>

        <button className="btn btn-primary" onClick={loadItems}>
          Refresh
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {items.length === 0 && !loading ? (
        <p className="text-muted">No items found</p>
      ) : (
        <div className="row g-4">
            {role === "ADMIN" && (
            <div className="col-md-4 col-lg-3">
                <div
                className="card border-0 rounded-4 p-3 h-100 text-white d-flex flex-column justify-content-center align-items-center"
                style={{
                    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                >
                <div className="text-center">
                    <div
                    style={{
                        fontSize: "3rem",
                        fontWeight: "bold",
                        color: "#ffd369",
                        marginBottom: "10px"
                    }}
                    >
                    +
                    </div>

                    <button className="btn btn-light text-primary fw-bold" onClick={() => navigate("/items/add")}>
                    Add new item
                    </button>
                </div>
                </div>
            </div>
            )}


            {items.map((item) => (
                <div key={item.id} className="col-md-4 col-lg-3">
                <div
                    className="card border-0 rounded-4 p-3 h-100 text-white d-flex flex-column justify-content-between"
                    style={{
                    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                    }}
                >
                    <div>
                    <h5 className="fw-bold mb-2">{item.name}</h5>

                    <p className="fw-bold fs-4" style={{ color: "#ffd369" }}>
                        ${item.price.toFixed(2)}
                    </p>
                    </div>

                    {/* Button */}
                    {role === "USER" && (
                    <button className="btn btn-light text-primary fw-bold mt-3" onClick={() => addToCart(item)}>
                        Add item
                    </button>
                    )}

                    {role === "ADMIN" && (
                    <button className="btn btn-danger fw-bold mt-3" onClick={() => handleDeleteItem(item.id)}>
                        Delete item
                    </button>
                    )}
                </div>
                </div>
            ))}
        </div>


      )}

      {/* Toast error */}
      <div
        className="toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3"
        role="alert"
        style={{ display: error ? "block" : "none" }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {error}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setError(null)}
          ></button>
        </div>
      </div>

    </div>
  );
}
