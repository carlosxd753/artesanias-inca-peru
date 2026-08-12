import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { isFirebaseConfigured } from "../../infrastructure/firebase/firebaseConfig";
import { loginUser } from "../../infrastructure/services/authService";
import { RegisterScreen } from "./RegisterScreen";

export function LoginScreen() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.includes("@") || password.length < 6) {
      Alert.alert(
        "Validación",
        "Ingrese correo válido y contraseña mínima de 6 caracteres.",
      );
      return;
    }

    try {
      setLoading(true);
      console.log("[UI LOGIN] Login para proyecto pedidos.");

      await loginUser(email, password);
    } catch (error) {
      console.log("[UI LOGIN] Error:", error);
      Alert.alert(
        "Error",
        isFirebaseConfigured
          ? "No se pudo iniciar sesión."
          : "Firebase todavía no está configurado.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <RegisterScreen onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center bg-slate-50 px-6"
    >
      <View className="mb-8">
        <Text className="font-extrabold tracking-[3px] text-indigo-600">
          Artesanias Inca Peru
        </Text>
        <Text className="mt-2 text-5xl font-black text-slate-900">
          Iniciar sesión
        </Text>
      </View>

      <View className="rounded-[28px] border border-slate-200 bg-white p-5">
        {!isFirebaseConfigured ? (
          <View className="mb-4 rounded-3xl border border-orange-300 bg-orange-50 p-4">
            <Text className="mb-1 text-lg font-black text-orange-700">
              Firebase pendiente
            </Text>
            <Text className="leading-6 text-orange-800">
              Pega tus credenciales reales en firebaseConfig.ts.
            </Text>
          </View>
        ) : null}

        <Text className="mb-2 font-bold text-slate-700">Correo</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="vendedor@correo.com"
          className="mb-4 rounded-2xl border border-slate-200 px-4 py-4 text-slate-900"
        />

        <Text className="mb-2 font-bold text-slate-700">Contraseña</Text>
        <View className="mb-5 flex-row items-center rounded-2xl border border-slate-200 px-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Mínimo 6 caracteres"
            className="flex-1 py-4 text-slate-900"
          />
          <Pressable onPress={() => setShowPassword((value) => !value)}>
            <Text className="font-black text-indigo-600">
              {showPassword ? "Ocultar" : "Ver"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="mb-3 rounded-2xl bg-indigo-600 py-4"
        >
          <Text className="text-center text-base font-black text-white">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowRegister(true)}
          className="rounded-2xl border border-indigo-200 py-4"
        >
          <Text className="text-center text-base font-black text-indigo-700">
            Crear cuenta
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
