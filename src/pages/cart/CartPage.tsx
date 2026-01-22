import { useCart } from "../../cart/CartContext";
import { useAuth } from "../../auth/AuthContext";
import { createOrder } from "../../api/orderApi";
import { extractErrorMessage } from "../../utils/errorUtils";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const totalPrice = cart.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );

  const increaseQuantity = (itemId: number) => {
    const item = cart.find(c => c.item.id === itemId);
    if (!item) return;
    updateQuantity(itemId, item.quantity + 1);
  };

  const decreaseQuantity = (itemId: number) => {
    const item = cart.find(c => c.item.id === itemId);
    if (!item) return;
    updateQuantity(itemId, item.quantity - 1);
  };

  const handleCreateOrder = async () => {
    try {
      await createOrder({
        userId: user!.userId,
        totalPrice,
        items: cart.map(c => ({
          item: c.item,
          quantity: c.quantity
        }))
      });

      clearCart();
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "750px" }}>
      <h2 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-muted">Cart is empty</p>
      ) : (
        <>
          <div className="list-group mb-4">
            {cart.map(c => (
              <div
                key={c.item.id}
                className="list-group-item d-flex justify-content-between align-items-center rounded-4 mb-3 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #f8f9fa, #eef1ff)",
                  borderLeft: "6px solid #4e54c8"
                }}
              >
                <div>
                  <h5 className="mb-1 fw-bold" style={{ color: "#4e54c8" }}>
                    {c.item.name}
                  </h5>
                  <p className="mb-0 fw-semibold" style={{ color: "#ff8c42" }}>
                    ${c.item.price}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* minus */}
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      fontWeight: "bold"
                    }}
                    onClick={() => decreaseQuantity(c.item.id)}
                  >
                    –
                  </button>

                  {/* quantity */}
                  <span
                    className="fw-bold fs-5 px-3 py-1 rounded"
                    style={{
                      backgroundColor: "#4e54c8",
                      color: "white",
                      minWidth: "40px",
                      textAlign: "center"
                    }}
                  >
                    {c.quantity}
                  </span>

                  {/* plus */}
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#4cd137",
                      color: "white",
                      fontWeight: "bold"
                    }}
                    onClick={() => increaseQuantity(c.item.id)}
                  >
                    +
                  </button>

                  {/* total for item */}
                  <span
                    className="fw-bold ms-3"
                    style={{ color: "#4e54c8", fontSize: "1.2rem" }}
                  >
                    ${(c.item.price * c.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 p-3 rounded-4 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
              color: "white"
            }}
          >
            <h4 className="fw-bold">Total: ${totalPrice.toFixed(2)}</h4>

            <button
              className="btn btn-light btn-lg fw-bold"
              style={{ color: "#4e54c8" }}
              onClick={handleCreateOrder}
            >
              Create Order
            </button>
          </div>
        </>
      )}

      {/* Toast error */}
      <div
        className="toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3"
        role="alert"
        style={{ display: error ? "block" : "none" }}
      >
        <div className="d-flex">
          <div className="toast-body">{error}</div>
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
