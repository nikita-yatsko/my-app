import { useEffect, useState } from "react";
import { OrderResponse } from "../../types/order.dto";
import { getAllOrders } from "../../api/orderApi";
import { Link } from "react-router-dom";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Пагинация
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const loadOrders = () => {
    setLoading(true);

    getAllOrders({
      from: normalizeDate(from),
      to: normalizeDate(to),
      status: status || undefined,
      page,
      limit
    })
      .then(data => {
        setOrders(data.content || []);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 403) {
          setError("Доступ запрещён. Только админ может просматривать заказы");
        } else {
          setError("Ошибка загрузки заказов");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const applyFilters = () => {
    setPage(0);
    loadOrders();
  };

  function normalizeDate(date: string): string | undefined {
    if (!date) return undefined;
    return date.length === 16 ? date + ":00" : date;
  }


  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
        All Orders
      </h2>

      {/* Фильтры */}
      <div className="card p-3 mb-4 shadow-sm rounded-4"
           style={{ background: "linear-gradient(135deg, #fff, #f3f4ff)" }}>
        <h5 className="fw-bold mb-3" style={{ color: "#4e54c8" }}>
          Filters
        </h5>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">From</label>
            <input
              type="datetime-local"
              className="form-control"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">To</label>
            <input
              type="datetime-local"
              className="form-control"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">Any</option>
              <option value="CREATED">CREATED</option>
              <option value="PAID">PAID</option>
              <option value="IN_PROCESS">IN_PROCESS</option>
              <option value="SHIPPED">SHIPPED</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary mt-3 fw-bold"
          style={{ backgroundColor: "#4e54c8" }}
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Список заказов */}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted">No orders found</p>
      ) : (
        <div className="list-group">
          {orders.map(order => {
            const o = order.orderDto;

            return (
              <Link
                to={`/order/${o.id}`} 
                className="text-decoration-none" 
                style={{ color: "inherit" }}>
                <div
                  key={o.id}
                  className="list-group-item rounded-4 mb-4 shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #fff, #f3f4ff)",
                    borderLeft: "6px solid #4e54c8"
                  }}
                >
                  <h4 className="fw-bold" style={{ color: "#4e54c8" }}>
                    Order #{o.id}
                  </h4>
                  <p className="fw-semibold">{order.name} {order.surname}</p>
                  <p className="text-muted">{order.email}</p>
                  <p>Status: <strong>{o.status}</strong></p>
                  <p className="fw-bold" style={{ color: "#ff8c42" }}>
                    Total: ${o.totalPrice}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Пагинация */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>

        <span className="fw-bold">
          Page {page + 1} of {totalPages}
        </span>

        <button
          className="btn btn-secondary"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
