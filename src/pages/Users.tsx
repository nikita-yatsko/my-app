import { useEffect, useState } from "react";
import { User, UserPage } from "../types/user.dto";
import { getUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [page, setPage] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const currentPage = page?.number ?? 0;
  const totalPages = page?.totalPages ?? 0;

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUsers(pageNumber, 10);
      setPage(data);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Users</h2>

      <table className="table table-bordered">
        <thead>
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

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 0}
          onClick={() => fetchUsers(currentPage - 1)}
        >
          Previous
        </button>

        <div>
          Page {currentPage + 1} / {totalPages}
        </div>

        <button
          className="btn btn-secondary"
          disabled={page?.last}
          onClick={() => fetchUsers(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
