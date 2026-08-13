import { LoginScreen } from "../presentation/screens/LoginScreen";
import { useAuth } from "../presentation/context/AuthContext";
import AppTabs from "./AppTabs";

export default function Index() {
  const { user, loadingSession } = useAuth();

  if (loadingSession) {
    return null;
  }

  return user ? <AppTabs /> : <LoginScreen />;
}
