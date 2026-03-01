import { useEffect, useState } from "react";
import { Card, CardPage } from "../../types/card.dto";
import { getCards } from "../../api/cardApi";
import { extractErrorMessage } from "../../utils/errorUtils";

export default function Cards() {
  const [page, setPage] = useState<CardPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Поля ввода
  const [holder, setHolder] = useState("");

  // Фильтры, которые реально применяются
  const [filters, setFilters] = useState({ holder: "" });

  // Пагинация
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Загрузка карт
  const fetchCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCards({
        page: currentPage,
        limit: pageSize,
        holder: filters.holder,
      });

      setPage(data);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // Загружаем при изменении страницы или фильтров
  useEffect(() => {
    fetchCards();
  }, [currentPage, filters]);

  // Поиск по кнопке
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setFilters({
      holder: holder.trim(),
    });
  };

  // Очистка фильтров
  const handleClear = () => {
    setHolder("");
    setCurrentPage(0);
    setFilters({ holder: "" });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  const totalPages = page?.totalPages ?? 0;

  return (
    <div
      className="container mt-5 p-4 rounded-4 shadow-sm"
      style={{
        background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)",
      }}
    >
      <h2 className="mb-4 fw-bold" style={{ color: "#1c1c1e" }}>Cards</h2>

      {/* SEARCH FORM */}
      <div
        className="card shadow-sm border-0 rounded-4 mb-4"
        style={{
          background: "linear-gradient(135deg, #f7f9fc, #eef2ff)",
          borderLeft: "6px solid #4c6ef5"
        }}
      >
        <div className="card-body p-4">
          <form onSubmit={handleSearch}>
            <div className="row g-3">

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Card Holder"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  style={{ borderColor: "#4c6ef5", color: "#1c1c1e" }}
                />
              </div>

              <div className="col-md-6 d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-lg w-50">
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-50"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* CARDS TABLE */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">

          <table className="table table-hover mb-0">
            <thead style={{ background: "#e3e7ff" }}>
              <tr>
                <th style={{ color: "#1c1c1e" }}>Number</th>
                <th style={{ color: "#1c1c1e" }}>Holder</th>
                <th style={{ color: "#1c1c1e" }}>Expiration</th>
                <th style={{ color: "#1c1c1e" }}>Status</th>
                <th style={{ color: "#1c1c1e" }}>Created</th>
              </tr>
            </thead>

            <tbody>
              {page?.content?.map((card: Card) => (
                <tr key={card.id} style={{ color: "#2c2c2e" }}>
                  <td className="fw-semibold">{card.number}</td>
                  <td className="fw-semibold">{card.holder}</td>
                  <td style={{ color: "#555" }}>{card.expirationDate}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${
                        card.active === "ACTIVE"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {card.active}
                    </span>
                  </td>
                  <td style={{ color: "#555" }}>{card.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {/* EMPTY STATE */}
      {page?.content?.length === 0 && !loading && (
        <div className="text-center mt-4" style={{ color: "#555" }}>
          No cards found
        </div>
      )}

      {/* PAGINATION */}
      {page && (
        <div className="d-flex justify-content-between align-items-center mt-4">

          <button
            className="btn btn-outline-primary px-4 py-2"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ← Previous
          </button>

          <div className="fw-bold" style={{ color: "#1c1c1e" }}>
            Page {currentPage + 1} of {totalPages}
          </div>

          <button
            className="btn btn-outline-primary px-4 py-2"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next →
          </button>

        </div>
      )}

      {/* ERROR TOAST */}
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
