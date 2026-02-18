import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../api/authApi";
import { tokenStorage } from "../../auth/tokenStorage";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, login: authLogin } = useAuth();

  // 🔥 Если пользователь уже залогинен — сразу уводим
  useEffect(() => {
    if (user) {
      navigate("/items");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);

      // API login
      const { accessToken, refreshToken } = await apiLogin({
        username,
        password
      });

      // сохраняем токены
      tokenStorage.setTokens(accessToken, refreshToken);

      // 🔥 обновляем user в AuthContext
      await authLogin(accessToken);

      // редирект произойдёт автоматически через useEffect
    } catch (err: any) {
      console.error(err);

      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        "Login failed";

      setError(serverMessage);
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card mt-5 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Enter your username and password
                </small>
              </div>

              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
