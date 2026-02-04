import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrder } from "../../api/orderApi";
import { OrderResponse } from "../../types/order.dto";
import { useAuth } from "../../auth/AuthContext";


export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    getOrderById(Number(id))
      .then(data => {
        setOrder(data);
        setItems(data.orderDto.items);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки заказа");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-5">Загрузка...</div>;
  if (error || !order) return <div className="container mt-5 text-danger">{error}</div>;

  const o = order.orderDto;

  // пересчёт суммы
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.item?.price || 0) * i.quantity,
    0
  );

  // изменение количества
  const increase = (itemId: number) => {
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrease = (itemId: number) => {
    setItems(prev =>
      prev.map(i =>
        i.id === itemId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  // отправка обновлённого заказа
  const saveChanges = async () => {
    setSaving(true);
    try {
      await updateOrder(o.id, {
        userId: user?.userId,
        totalPrice,
        items: items.map(i => ({
          item: i.item,
          quantity: i.quantity
        }))
      });

      alert("Order updated");
    } catch {
      alert("Ошибка при обновлении заказа");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
        Order #{o.id}
      </h2>

      {/* Информация о заказе */}
      <div
        className="card p-4 shadow-sm rounded-4 mb-4"
        style={{ background: "linear-gradient(135deg, #fff, #f3f4ff)" }}
      >
        <h4 className="fw-bold" style={{ color: "#4e54c8" }}>Customer</h4>
        <p className="fw-semibold mt-2">{order.name} {order.surname}</p>
        <p className="text-muted">{order.email}</p>

        <h4 className="fw-bold mt-4" style={{ color: "#4e54c8" }}>Order Info</h4>

        <p className="mt-2">
          Status:{" "}
          <strong
            style={{
              color:
                o.status === "CREATED"
                  ? "#ff8c42"
                  : o.status === "PAID"
                  ? "#4cd137"
                  : "#4e54c8"
            }}
          >
            {o.status}
          </strong>
        </p>

        <p className="fw-bold" style={{ color: "#ff8c42" }}>
          Total: ${totalPrice.toFixed(2)}
        </p>

        <p className="text-muted">
          Created: {new Date(o.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Товары */}
      <h4 className="fw-bold mb-3" style={{ color: "#4e54c8" }}>Items</h4>

      <ul className="list-group">
        {items.map(item => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center rounded-4 mb-3 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #eef1ff)",
              borderLeft: "6px solid #8f94fb"
            }}
          >
            <div>
              <span className="fw-bold" style={{ color: "#4e54c8" }}>
                {item.item ? item.item.name : "Deleted item"}
              </span>
              <br />
              <span className="text-muted small">
                {item.item ? `$${item.item.price}` : ""}
              </span>
            </div>

            {o.status === "CREATED" ? (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-danger btn-sm fw-bold"
                  onClick={() => decrease(item.id)}
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
                  {item.quantity}
                </span>

                <button
                  className="btn btn-success btn-sm fw-bold"
                  onClick={() => increase(item.id)}
                >
                  +
                </button>
              </div>
            ) : (
              <span
                className="fw-bold"
                style={{ color: "#4e54c8", fontSize: "1.1rem" }}
              >
                {item.quantity} pcs.
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Кнопка сохранения */}
      {o.status === "CREATED" && (
        <button
          className="btn btn-primary btn-lg fw-bold mt-4"
          style={{ backgroundColor: "#4e54c8" }}
          onClick={saveChanges}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      )}
    </div>
  );
}
