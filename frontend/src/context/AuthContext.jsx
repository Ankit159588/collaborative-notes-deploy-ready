import { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessTokenUpdater } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccessTokenUpdater(setAccessToken);

    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/rotate-token");

        const newAccessToken = response.data.data.accessToken;

        setAccessToken(newAccessToken);

        const meResponse = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        setUser(meResponse.data.user);
      } catch (error) {
        console.log("No active session");
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
