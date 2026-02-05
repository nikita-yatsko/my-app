import { useEffect, useState } from "react";
import { payOrder } from "../../api/paymentApi";
import { getCardsByUserId } from "../../api/cardApi";
import { extractErrorMessage } from "../../utils/errorUtils";

interface PaymentModalProps { 
    order: any;
    userId: number; 
    onClose: () => void; 
    onSuccess: () => void; 
    setPaymentResult: (result: { message: string; type: "success" | "error" }) => void;
}

export default function PaymentModal({ order, userId, onClose, onSuccess, setPaymentResult }: PaymentModalProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getCardsByUserId(userId);

        const activeCards = data.filter((c: any) => c.active === "ACTIVE");

        setCards(activeCards);
      } catch (e: any) {
        setError(extractErrorMessage(e));
      }
    };

    loadCards();
  }, [userId]);

  const handlePay = async () => {
    if (!selectedCard) {
      setError("Please select a card");
      return;
    }

    try {
      const result = await payOrder(order.id, userId, order.totalPrice);

      if (result.status === "SUCCESS") {
        setPaymentResult({
          message: "Payment successful",
          type: "success"
        });
      } else {
        setPaymentResult({
          message: "Payment failed",
          type: "error"
        });
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      setPaymentResult({
        message: extractErrorMessage(e),
        type: "error"
      });
    }
  };

  const maskCardNumber = (num: string) =>
    `**** **** **** ${num.slice(-4)}`;

  const formatExpiration = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Pay for Order #{order.id}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <h6 className="fw-bold mb-3">Select a card</h6>

            {cards.length === 0 ? (
              <p className="text-muted">You have no active cards</p>
            ) : (
              <div className="list-group">
                {cards.map(card => (
                  <label
                    key={card.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <strong style={{ letterSpacing: "2px" }}>
                        {maskCardNumber(card.number)}
                      </strong>

                      <div className="text-muted">
                        Expires {formatExpiration(card.expirationDate)}
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="card"
                      value={card.id}
                      onChange={() => setSelectedCard(card.id)}
                    />
                  </label>
                ))}
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3">{error}</div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            {cards.length > 0 && (
              <button className="btn btn-success fw-bold" onClick={handlePay}>
                Confirm Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
