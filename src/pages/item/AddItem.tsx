import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../../utils/errorUtils";
import { createItem } from "../../api/itemApi";

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createItem({ name, price: Number(price) });
      navigate("/items");
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="fw-bold mb-4">Add New Item</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm rounded-4">

        <div className="mb-3">
          <label className="form-label fw-bold">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter item name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            required
            min="0"
            step="0.01"
            placeholder="Enter price"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>

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
