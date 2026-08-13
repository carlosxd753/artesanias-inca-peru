import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  Animated,
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

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useState(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      className="flex-1"
    >
      <View
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
        style={{ backgroundColor: "#0f172a" }}
      >
        <View
          className="absolute -top-20 -right-20 rounded-full opacity-20"
          style={{ width: 300, height: 300, backgroundColor: "#6366f1" }}
        />
        <View
          className="absolute -bottom-32 -left-32 rounded-full opacity-10"
          style={{ width: 400, height: 400, backgroundColor: "#8b5cf6" }}
        />
      </View>

      <Animated.View
        className="flex-1 justify-center px-6"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }}
      >
        <View className="items-center mb-10">
          <View
            className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
            style={{
              backgroundColor: "#6366f1",
              shadowColor: "#6366f1",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Text className="text-3xl font-black text-white">AI</Text>
          </View>
          <Text className="text-2xl font-black text-white tracking-wider">
            Artesanías Inca Perú
          </Text>
          <Text className="mt-1 text-sm text-slate-400 tracking-wide">
            Sistema de pedidos
          </Text>
        </View>

        <View
          className="rounded-[32px] p-6"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.85)",
            borderWidth: 1,
            borderColor: "rgba(99, 102, 241, 0.2)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.5,
            shadowRadius: 40,
            elevation: 20,
          }}
        >
          {!isFirebaseConfigured ? (
            <View
              className="mb-5 rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.15)",
                borderWidth: 1,
                borderColor: "rgba(251, 191, 36, 0.3)",
              }}
            >
              <Text className="text-base font-black text-amber-400 mb-1">
                ⚠️ Firebase pendiente
              </Text>
              <Text className="text-sm text-amber-200 leading-5">
                Pega tus credenciales reales en firebaseConfig.ts para activar
                el servicio.
              </Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
              Correo electrónico
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="vendedor@correo.com"
              placeholderTextColor="#64748b"
              className="rounded-2xl px-5 py-4 text-white text-base"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.3)",
              }}
            />
          </View>

          <View className="mb-6">
            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
              Contraseña
            </Text>
            <View
              className="flex-row items-center rounded-2xl px-5"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.3)",
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#64748b"
                className="flex-1 py-4 text-white text-base"
              />
              <Pressable
                onPress={() => setShowPassword((value) => !value)}
                className="pl-3"
              >
                <Text className="font-black text-indigo-400 text-sm">
                  {showPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="rounded-2xl py-4 mb-3 overflow-hidden"
            style={{
              backgroundColor: loading ? "#4338ca" : "#6366f1",
              shadowColor: "#6366f1",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="text-center text-base font-black text-white">
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowRegister(true)}
            className="rounded-2xl py-4"
            style={{
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          >
            <Text className="text-center text-base font-black text-indigo-300">
              Crear cuenta nueva
            </Text>
          </Pressable>
        </View>

        <Text className="text-center text-xs text-slate-500 mt-6">
          © 2026 Artesanías Inca Perú
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
