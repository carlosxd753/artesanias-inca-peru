import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import {
  auth,
  isFirebaseConfigured,
} from "infrastructure/firebase/firebaseConfig";

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
) => {
  console.log("[AUTH REGISTER] Registrando usuario:", email);

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  console.log("[AUTH REGISTER] Usuario creado. UID:", credential.user.uid);

  await updateProfile(credential.user, { displayName });

  console.log("[AUTH REGISTER] Nombre actualizado:", displayName);

  return credential;
};

export const loginUser = async (email: string, password: string) => {
  console.log("[AUTH LOGIN] Intentando login:", email);

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);

  console.log("[AUTH LOGIN] Login correcto. UID:", credential.user.uid);

  return credential;
};

export const logoutUser = async () => {
  console.log("[AUTH LOGOUT] Cerrando sesión...");

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  await signOut(auth);

  console.log("[AUTH LOGOUT] Sesión cerrada.");
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  console.log("[AUTH PASSWORD] Cambiando contraseña...");

  if (!isFirebaseConfigured) {
    throw new Error("Firebase todavía no está configurado.");
  }

  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No hay un usuario autenticado.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  await reauthenticateWithCredential(user, credential);

  await updatePassword(user, newPassword);

  console.log("[AUTH PASSWORD] Contraseña actualizada correctamente.");
};
