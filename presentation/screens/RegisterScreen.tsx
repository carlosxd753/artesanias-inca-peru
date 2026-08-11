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
import { registerUser } from "../../infrastructure/services/authService";

interface Props {
  onBackToLogin: () => void;
}

export function RegisterScreen({ onBackToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (name.trim().length < 3 || !email.includes("@") || password.length < 6) {
      Alert.alert("Validación", "Complete nombre, correo y contraseña válida.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validación", "Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      console.log("[UI REGISTER] Registro para proyecto pedidos.");

      // TODO 13:
      // Llamar al servicio registerUser(email, password, name).
      await registerUser(email, password, name);
    } catch (error) {
      console.log("[UI REGISTER] Error:", error);
      Alert.alert("Error", "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center bg-slate-50 px-6"
    >
      <View className="mb-6">
        <Text className="font-extrabold tracking-[3px] text-indigo-600">
          SEMANA 11 · REGISTRO
        </Text>
        <Text className="mt-2 text-4xl font-black text-slate-900">
          Crear vendedor
        </Text>
        <Text className="mt-3 text-base leading-6 text-slate-500">
          El UID del vendedor se usará para guardar sus pedidos.
        </Text>
      </View>

      <View className="rounded-[28px] border border-slate-200 bg-white p-5">
        <TextInput value={name} onChangeText={setName} placeholder="Nombre" className="mb-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="vendedor@correo.com" className="mb-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Contraseña" className="mb-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
        <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirmar contraseña" className="mb-4 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />

        <Pressable onPress={handleRegister} disabled={loading} className="mb-3 rounded-2xl bg-indigo-600 py-4">
          <Text className="text-center text-base font-black text-white">
            {loading ? "Creando..." : "Registrarme"}
          </Text>
        </Pressable>

        <Pressable onPress={onBackToLogin} className="rounded-2xl border border-indigo-200 py-4">
          <Text className="text-center text-base font-black text-indigo-700">
            Ya tengo cuenta
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
