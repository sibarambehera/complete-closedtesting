import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseconfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("cc_user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          localStorage.removeItem("cc_user");
          setLoading(false);
          return;
        }

        const savedUser =
          localStorage.getItem("cc_user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "cc_user",
      JSON.stringify(userData)
    );
  };

  const logout = async () => {
    try {
      const { signOut } = await import("firebase/auth");

      await signOut(auth);

      setUser(null);
      localStorage.removeItem("cc_user");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
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