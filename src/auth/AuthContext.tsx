import { createContext, useContext, useEffect, useState } from "react";
import { validateToken } from "../api/authApi";
import { ValidateResponse } from "../types/auth";

interface AuthContextType {
  user: ValidateResponse | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Инициализация авторизации при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const result = await validateToken();
        setUser(result);
      } catch {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔥 ЛОГИН
  const login = async (token: string) => {
    localStorage.setItem("token", token);

    try {
      const result = await validateToken();
      setUser(result);
    } catch {
      setUser(null);
      localStorage.removeItem("token");
      throw new Error("Token validation failed");
    }
  };

  // 🔥 ЛОГАУТ
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
