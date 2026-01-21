import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../../utils/errorUtils";

import { User } from "../../types/user.dto";
import { getUserById, deleteUser, activateUser, deactivateUser } from "../../api/userApi";
import { useAuth } from "../../auth/AuthContext";

import { Card } from "../../types/card.dto";
import { getCardsByUserId, deleteCard, deactivateCard, activateCard, createCard } from "../../api/cardApi";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cards, setCards] = useState<Card[]>([]);

  const role = authUser?.role;

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserById(Number(id));
        setUser(data);

        const userCards = await getCardsByUserId(Number(id));
        setCards(userCards);

      } catch (e: any) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDeleteUser = async () => {
    if (!id) return;

    try {
      await deleteUser(Number(id));
      navigate("/users");
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    try {
      await deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const handleToggleActiveUser = async () => {
    if (!id || !user) return;

    const isActive = user.active === "ACTIVE";

    try {
      if (isActive) {
        await deactivateUser(Number(id));
      } else {
        await activateUser(Number(id));
      }

      const updated = await getUserById(Number(id));
      setUser(updated);

    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const handleToggleActiveCard = async (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const isActive = card.active === "ACTIVE";

    try {
      if (isActive) {
        await deactivateCard(cardId);
      } else {
        await activateCard(cardId);
      }

      // Обновляем список карт
      const updatedCards = await getCardsByUserId(Number(id));
      setCards(updatedCards);

    } catch (e: any) {
      setError(extractErrorMessage(e));
    }
  };

  const handleCreateCard = async () => {
    if (!id) return;

      try {
        await createCard(Number(id));

        // обновляем список карт
        const updatedCards = await getCardsByUserId(Number(id));
        setCards(updatedCards);

      } catch (e: any) {
        setError(extractErrorMessage(e));
      }
  };

  if (loading || authLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user || !role) return null;

  const birthYear = user.birthDate ? new Date(user.birthDate).getFullYear() : "";

  return (
    <div className="container mt-5">

      <h2 className="mb-4 fw-bold">User Details</h2>

      {/* USER CARD */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body p-4">

          {role === "ADMIN" && (
            <p className="text-muted small mb-2">
              <b>User ID:</b> {user.userId}
            </p>
          )}

          <h4 className="fw-bold mb-3">{user.name} {user.surname}</h4>

          <p><b>Email:</b> {user.email}</p>
          <p><b>Birth year:</b> {birthYear}</p>

          {role === "ADMIN" && (
            <>
              <hr />

              <p>
                <b>Status:</b>{" "}
                <span className={`badge ${user.active === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                  {user.active}
                </span>
              </p>

              <p className="text-muted small"><b>Created:</b> {user.createdAt}</p>
              <p className="text-muted small"><b>Updated:</b> {user.updatedAt}</p>

              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-warning" onClick={handleToggleActiveUser}>
                  {user.active === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>

                <button className="btn btn-danger" onClick={handleDeleteUser}>
                  Delete user
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* USER CARDS */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">User Cards</h3>

        <button className="btn btn-primary" onClick={handleCreateCard}>
            + Create Card
          </button>
      </div>


      {cards.length === 0 ? (
        <p className="text-muted">No cards found</p>
      ) : (
        <div className="row g-4">
          {cards.map(card => (
            <div key={card.id} className="col-md-6 col-lg-4">
              <div className="card shadow-lg border-0 rounded-4 bg-dark text-white p-3 position-relative">

                {/* Decorative circles */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "120px",
                    height: "120px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "-30px",
                    width: "150px",
                    height: "150px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "50%",
                  }}
                />

                <div className="card-body position-relative">

                  {role === "ADMIN" && (
                    <p className="text-light small mb-1 opacity-75">
                      <b>ID:</b> {card.id}
                    </p>
                  )}

                  <p className="fs-5 fw-bold mt-3">
                    {card.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                  </p>

                  <p className="text-uppercase small mb-1">
                    <b>{card.holder}</b>
                  </p>

                  <p className="small mb-3">
                    {card.expirationDate}
                  </p>

                  <span
                    className={`badge ${card.active === "ACTIVE" ? "bg-success" : "bg-secondary"}`}
                  >
                    {card.active}
                  </span>

                  {role === "ADMIN" && (
                    <>
                      <hr className="border-light" />

                      {/* Кнопка активации/деактивации карты */}
                      <button
                        className={`btn ${card.active === "ACTIVE" ? "btn-warning" : "btn-success"} w-100 mt-2`}
                        onClick={() => handleToggleActiveCard(card.id)}
                      >
                        {card.active === "ACTIVE" ? "Deactivate card" : "Activate card"}
                      </button>

                      {/* Кнопка удаления */}
                      <button
                        className="btn btn-danger w-100 mt-2"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        Delete card
                      </button>
                    </>
                  )}

                </div>
              </div>
            </div>
          ))}
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
