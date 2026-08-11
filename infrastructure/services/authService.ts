import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "infrastructure/firebase/firebaseConfig";


export const registerUser = async (
  email: string,
  password: string,
  displayName: string
) => {
  console.log("[AUTH REGISTER] Registrando usuario:", email);

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  // TODO 6:
  // Crear usuario con createUserWithEmailAndPassword.
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  console.log("[AUTH REGISTER] Usuario creado. UID:", credential.user.uid);

  // TODO 7:
  // Guardar nombre visible con updateProfile.
  await updateProfile(credential.user, { displayName });

 console.log("[AUTH REGISTER] Nombre actualizado:", displayName);
  return credential;
};

export const loginUser = async (email: string, password: string) => {
  console.log("[AUTH LOGIN] Intentando login:", email);

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  // TODO 8:
  // Iniciar sesión con signInWithEmailAndPassword.
  const credential = await signInWithEmailAndPassword(auth, email, password);

  console.log("[AUTH LOGIN] Login correcto. UID:", credential.user.uid);
  return credential;
};

export const logoutUser = async () => {
  console.log("[AUTH LOGOUT] Cerrando sesión...");

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  // TODO 9:
  // Cerrar sesión con signOut.
  await signOut(auth);
  console.log("[AUTH LOGOUT] Sesión cerrada.");
};
