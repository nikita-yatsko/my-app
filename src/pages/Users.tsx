import { useEffect, useState } from "react";
import { User, UserPage } from "../types/user.dto";
import { getUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";

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
      setError(e.message || "Failed to load users");
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
    <div className="container mt-5">
      <h2 className="mb-4">Users</h2>

      {/* Форма поиска */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Таблица */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>UserId</th>
            <th>Name</th>
            <th>Surname</th>
            <th>BirthDate</th>
            <th>Email</th>
            <th>Status</th>
            <th>CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {page?.content?.map((user: User) => (
            <tr
              key={user.userId}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/${user.userId}`)}
            >
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.birthDate}</td>
              <td>{user.email}</td>
              <td>{user.active}</td>
              <td>{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Если ничего не найдено */}
      {page?.content?.length === 0 && !loading && (
        <div className="text-center text-muted mt-4">
          No users found
        </div>
      )}

      {/* Пагинация */}
      {page && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <div>
            Page {currentPage + 1} of {totalPages}
          </div>

          <button
            className="btn btn-secondary"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
