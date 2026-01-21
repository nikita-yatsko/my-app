import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { User } from "../types/user.dto";
import { getUserById, deleteUser, activateUser, deactivateUser } from "../api/userApi";
import { useAuth } from "../auth/AuthContext";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = authUser?.role;

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserById(Number(id));
        setUser(data);
      } catch (e: any) {
        setError(e.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteUser(Number(id));
      navigate("/users");
    } catch (e: any) {
      setError(e.message || "Failed to delete user");
    }
  };

  const handleToggleActive = async () => {
  if (!id || !user) return;

  const isCurrentlyActive = user.active === "ACTIVE";
  const action = isCurrentlyActive ? "deactivate" : "activate";

  try {
    if (isCurrentlyActive) {
      await deactivateUser(Number(id)); 
    } else {
      await activateUser(Number(id));  
    }

    const updated = await getUserById(Number(id));
    setUser(updated);

  } catch (e: any) {
    setError(e.message || `Failed to ${action} user`);
  }
};

  if (loading || authLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!user || !role) return null;

  const birthYear = user.birthDate
    ? new Date(user.birthDate).getFullYear()
    : "";

  return (
    <div className="container mt-5">
      <h2>User Details</h2>

      <div className="card mt-4">
        <div className="card-body">

          {/* Только ADMIN */}
          {role === "ADMIN" && (
            <p><b>User ID:</b> {user.userId}</p>
          )}

          {/* Поля, видимые всем */}
          <p><b>Name:</b> {user.name}</p>
          <p><b>Surname:</b> {user.surname}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Birth year:</b> {birthYear}</p>

          {/* Только ADMIN */}
          {role === "ADMIN" && (
            <>
              <hr />

              <p><b>Status:</b> {user.active}</p>
              <p><b>Created at:</b> {user.createdAt}</p>
              <p><b>Updated at:</b> {user.updatedAt}</p>

              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-warning" onClick={handleToggleActive}>
                  {user.active === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>

                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete user
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
