import { useEffect, useState } from "react";
import {
  getPaymentsByAny,
  getTotalPaymentsAll,
  getTotalPaymentsByUser
} from "../../api/paymentApi";
import { extractErrorMessage } from "../../utils/errorUtils";
import { useAuth } from "../../auth/AuthContext";

export default function PaymentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Filters for search
  const [filters, setFilters] = useState({
    userId: isAdmin ? "" : String(user?.userId ?? ""),
    orderId: "",
    status: ""
  });

  // Total ALL users fields (admin only)
  const [fromAll, setFromAll] = useState("");
  const [toAll, setToAll] = useState("");

  // Total BY USER fields
  const [userIdTotal, setUserIdTotal] = useState(isAdmin ? "" : String(user?.userId ?? ""));
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");

  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [totalAll, setTotalAll] = useState<number | null>(null);
  const [totalUser, setTotalUser] = useState<number | null>(null);

  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const loadPayments = async () => {
    try {
      const data = await getPaymentsByAny(
        filters.userId || undefined,
        filters.orderId || undefined,
        filters.status || undefined
      );
      setPayments(data);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const loadTotalAll = async () => {
    try {
      if (!fromAll || !toAll) {
        setError("Please select both dates for total all users");
        return;
      }

      const sum = await getTotalPaymentsAll(
        new Date(fromAll).toISOString(),
        new Date(toAll).toISOString()
      );
      setTotalAll(sum);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const loadTotalUser = async () => {
    try {
      if (!userIdTotal) {
        setError("User ID is required");
        return;
      }
      if (!fromUser || !toUser) {
        setError("Please select both dates for user total");
        return;
      }

      const sum = await getTotalPaymentsByUser(
        userIdTotal,
        new Date(fromUser).toISOString(),
        new Date(toUser).toISOString()
      );
      setTotalUser(sum);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const sortPayments = (field: string) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(direction);

    setPayments(prev =>
      [...prev].sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold mb-4" style={{ color: "#4e54c8" }}>
        Payments Search
      </h2>

      {/* ---------------------- SEARCH FILTERS ---------------------- */}

      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3">

          {/* USER ID FIELD */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">User ID</label>
            <input
              type="text"
              name="userId"
              className="form-control"
              value={filters.userId}
              onChange={handleChange}
              disabled={!isAdmin}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Order ID</label>
            <input
              type="text"
              name="orderId"
              className="form-control"
              value={filters.orderId}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Status</label>
            <select
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary mt-3 fw-bold"
          style={{ backgroundColor: "#4e54c8" }}
          onClick={loadPayments}
        >
          Search
        </button>

        {/* ---------------------- TOTAL ALL USERS (ADMIN ONLY) ---------------------- */}

        {isAdmin && (
          <>
            <hr className="my-4" />

            <h5 className="fw-bold" style={{ color: "#4e54c8" }}>
              Total Payments (All Users, SUCCESS only)
            </h5>

            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label fw-semibold">From</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={fromAll}
                  onChange={(e) => setFromAll(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">To</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={toAll}
                  onChange={(e) => setToAll(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-success mt-3 fw-bold"
              onClick={loadTotalAll}
            >
              Get Total (All Users)
            </button>

            {totalAll !== null && (
              <div className="alert alert-info mt-3 fw-bold">
                Total successful payments (all users): ${totalAll.toFixed(2)}
              </div>
            )}
          </>
        )}

        {/* ---------------------- TOTAL BY USER ---------------------- */}

        <hr className="my-4" />

        <h5 className="fw-bold" style={{ color: "#4e54c8" }}>
          Total Payments for Specific User (SUCCESS only)
        </h5>

        <div className="row g-3 mt-1">
          <div className="col-md-4">
            <label className="form-label fw-semibold">User ID</label>
            <input
              type="text"
              className="form-control"
              value={userIdTotal}
              onChange={(e) => setUserIdTotal(e.target.value)}
              disabled={!isAdmin}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">From</label>
            <input
              type="datetime-local"
              className="form-control"
              value={fromUser}
              onChange={(e) => setFromUser(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">To</label>
            <input
              type="datetime-local"
              className="form-control"
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-warning mt-3 fw-bold"
          onClick={loadTotalUser}
        >
          Get Total for User
        </button>

        {totalUser !== null && (
          <div className="alert alert-warning mt-3 fw-bold">
            Total for user {userIdTotal}: ${totalUser.toFixed(2)}
          </div>
        )}
      </div>

      {/* ---------------------- PAYMENTS TABLE ---------------------- */}

      {payments.length === 0 ? (
        <p className="text-muted">No payments found</p>
      ) : (
        <table className="table table-striped table-hover shadow-sm">
          <thead>
            <tr>
              <th onClick={() => sortPayments("id")} style={{ cursor: "pointer" }}>
                ID
              </th>
              <th onClick={() => sortPayments("orderId")} style={{ cursor: "pointer" }}>
                Order ID
              </th>
              <th onClick={() => sortPayments("userId")} style={{ cursor: "pointer" }}>
                User ID
              </th>
              <th onClick={() => sortPayments("paymentAmount")} style={{ cursor: "pointer" }}>
                Amount
              </th>
              <th onClick={() => sortPayments("status")} style={{ cursor: "pointer" }}>
                Status
              </th>
              <th onClick={() => sortPayments("timestamp")} style={{ cursor: "pointer" }}>
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.orderId}</td>
                <td>{p.userId}</td>
                <td>${p.paymentAmount}</td>
                <td>{p.status}</td>
                <td>{new Date(p.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------------- ERROR TOAST ---------------------- */}

      {error && (
        <div
          className="toast align-items-center text-bg-danger border-0 position-fixed bottom-0 end-0 m-3"
          role="alert"
          style={{ display: "block", zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold">
              {error}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setError(null)}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
