import { useCart } from "../../cart/CartContext";
import { useAuth } from "../../auth/AuthContext";
import { createOrder, getOrdersByUserId } from "../../api/orderApi";
import { extractErrorMessage } from "../../utils/errorUtils";
import { useEffect, useState } from "react";
import PaymentModal from "../../pages/payment/PaymentModal";

export default function CartPage() {
  const { cart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);

  const [paymentResult, setPaymentResult] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const totalPrice = cart.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );

  const loadOrders = async () => {
    if (!user) return;

    try {
      const data = await getOrdersByUserId(user.userId);
      setOrders(data);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

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
      await loadOrders();
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  if (!user) {
    return <p className="text-muted">You must be logged in to view this page.</p>;
  }

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

          <div
            className="d-flex justify-content-between align-items-center mt-4 p-3 rounded-4 shadow-sm"
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

      <h3 className="fw-bold mt-5 mb-3" style={{ color: "#4e54c8" }}>
        Your Orders
      </h3>

      {orders.length === 0 ? (
        <p className="text-muted">You have no orders yet</p>
      ) : (
        <div className="list-group">
          {orders.map(o => (
            <div
              key={o.orderDto.id}
              className="list-group-item rounded-4 mb-3 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #fff, #f3f4ff)",
                borderLeft: "6px solid #8f94fb"
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold" style={{ color: "#4e54c8" }}>
                    Order #{o.orderDto.id}
                  </h5>
                  <p className="mb-0 text-muted">
                    Status:{" "}
                    <span className="fw-semibold">{o.orderDto.status}</span>
                  </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span
                    className="fw-bold"
                    style={{ color: "#ff8c42", fontSize: "1.2rem" }}
                  >
                    ${o.orderDto.totalPrice}
                  </span>

                  {o.orderDto.status === "CREATED" && (
                    <button
                      className="btn btn-success fw-bold"
                      onClick={() => setPaymentOrder(o.orderDto)}
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          className="toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3"
          role="alert"
          style={{ display: "block" }}
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
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          userId={user.userId}
          onClose={() => setPaymentOrder(null)}
          onSuccess={loadOrders}
          setPaymentResult={setPaymentResult}
        />
      )}

      {paymentResult && (
        <div
          className={`toast align-items-center border-0 position-fixed bottom-0 end-0 m-3 
            ${paymentResult.type === "success" ? "text-bg-success" : "text-bg-danger"}`}
          role="alert"
          style={{ display: "block" }}
        >
          <div className="d-flex">
            <div className="toast-body">
              {paymentResult.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setPaymentResult(null)}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
