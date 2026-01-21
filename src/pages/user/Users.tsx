import { useEffect, useState } from "react";
import { User, UserPage } from "../../types/user.dto";
import { getUsers } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../../utils/errorUtils";

export default function Users() {
  const [page, setPage] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Поля для поиска
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");

  // Пагинация
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  // Функция загрузки пользователей
  const fetchUsers = async (searchFirstName = firstName, searchSurname = surname) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUsers({
        page: currentPage,
        size: pageSize,
        firstName: searchFirstName.trim() || undefined,
        surname: searchSurname.trim() || undefined,
      });
      setPage(data);
    } catch (e: any) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // Загружаем всех пользователей при первом открытии страницы
  useEffect(() => {
    fetchUsers();
  }, []);

  // Поиск по кнопке
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  // Очистка фильтров — сразу сбрасываем и отправляем запрос с пустыми значениями
  const handleClear = () => {
    setFirstName("");
    setSurname("");
    setCurrentPage(0);

    // Передаём пустые значения напрямую — не ждём обновления состояния
    fetchUsers("", "");
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
    <h2 className="mb-4 fw-bold" style={{ color: "#1c1c1e" }}>Users</h2>

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

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ borderColor: "#4c6ef5", color: "#1c1c1e" }}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                style={{ borderColor: "#9775fa", color: "#1c1c1e" }}
              />
            </div>

            <div className="col-md-4 d-flex gap-2">
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

    {/* USERS TABLE */}
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-0">

        <table className="table table-hover mb-0">
          <thead style={{ background: "#e3e7ff" }}>
            <tr>
              <th style={{ color: "#1c1c1e" }}>Name</th>
              <th style={{ color: "#1c1c1e" }}>Surname</th>
              <th style={{ color: "#1c1c1e" }}>Birth Date</th>
              <th style={{ color: "#1c1c1e" }}>Email</th>
              <th style={{ color: "#1c1c1e" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {page?.content?.map((user: User) => (
              <tr
                key={user.userId}
                style={{ cursor: "pointer", color: "#2c2c2e" }}
                onClick={() => navigate(`/user/${user.userId}`)}
              >
                <td className="fw-semibold">{user.name}</td>
                <td className="fw-semibold">{user.surname}</td>
                <td style={{ color: "#555" }}>{user.birthDate}</td>
                <td style={{ color: "#2a4fff" }}>{user.email}</td>
                <td>
                  <span
                    className={`badge px-3 py-2 ${
                      user.active === "ACTIVE"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {user.active}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>

    {/* EMPTY STATE */}
    {page?.content?.length === 0 && !loading && (
      <div className="text-center mt-4" style={{ color: "#555" }}>
        No users found
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
