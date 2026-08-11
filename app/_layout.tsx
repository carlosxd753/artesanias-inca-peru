import { Stack } from "expo-router";
import { AuthProvider } from "../presentation/context/AuthContext";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
