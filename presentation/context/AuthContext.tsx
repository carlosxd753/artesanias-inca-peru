import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../../infrastructure/firebase/firebaseConfig";
import { initDatabase } from "../../infrastructure/database/database";

interface AuthContextValue {
  user: User | null;
  loadingSession: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loadingSession: true,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    console.log("[AUTH SESSION] Escuchando sesión en proyecto de pedidos...");

    initDatabase().catch((error) => {
      console.log("[SQLITE] Error inicializando base de datos:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("[AUTH SESSION] Usuario autenticado:", {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        console.log("[AUTH SESSION] No hay usuario autenticado.");
      }

      setUser(firebaseUser);
      setLoadingSession(false);
    });

    return () => {
      console.log("[AUTH SESSION] Dejando de escuchar sesión.");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
