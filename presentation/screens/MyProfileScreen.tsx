import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

import {
  changePassword,
  logoutUser,
} from "../../infrastructure/services/authService";

import { getPedidosByUser } from "../../infrastructure/services/pedidosService";

import { Pedido } from "../../domain/models/Pedido";

export function MyProfileScreen() {
  const { user } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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

  useEffect(() => {
    loadPedidos();
  }, [user?.uid]);

  const loadPedidos = async () => {
    if (!user) {
      setPedidos([]);
      setLoadingPedidos(false);
      return;
    }

    try {
      setLoadingPedidos(true);

      console.log("[UI PROFILE] Cargando pedidos del usuario:", user.uid);

      const data = await getPedidosByUser(user.uid);

      setPedidos(data);
    } catch (error) {
      console.log("[UI PROFILE] Error cargando pedidos:", error);

      Alert.alert("Error", "No se pudieron cargar tus pedidos.");
    } finally {
      setLoadingPedidos(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Validación", "Completa todos los campos.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Validación",
        "La nueva contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validación", "Las nuevas contraseñas no coinciden.");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Validación",
        "La nueva contraseña debe ser diferente a la actual.",
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordModal(false);

      Alert.alert(
        "Contraseña actualizada",
        "Tu contraseña se cambió correctamente.",
      );
    } catch (error: any) {
      console.log("[UI PROFILE] Error cambiando contraseña:", error);

      if (
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/invalid-credential"
      ) {
        Alert.alert(
          "Contraseña incorrecta",
          "La contraseña actual no es correcta.",
        );
      } else if (error?.code === "auth/too-many-requests") {
        Alert.alert(
          "Demasiados intentos",
          "Espera un momento antes de volver a intentarlo.",
        );
      } else {
        Alert.alert("Error", "No se pudo cambiar la contraseña.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logoutUser();
            } catch (error) {
              console.log("[UI PROFILE] Error cerrando sesión:", error);

              Alert.alert("Error", "No se pudo cerrar la sesión.");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getStatusStyle = (estado: Pedido["estado"]) => {
    switch (estado) {
      case "ENTREGADO":
        return {
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          borderColor: "rgba(34, 197, 94, 0.25)",
          textColor: "#4ade80",
        };

      case "ENVIADO":
        return {
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          borderColor: "rgba(59, 130, 246, 0.25)",
          textColor: "#60a5fa",
        };

      default:
        return {
          backgroundColor: "rgba(251, 191, 36, 0.12)",
          borderColor: "rgba(251, 191, 36, 0.25)",
          textColor: "#fbbf24",
        };
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#0f172a" }}>
      <View className="absolute inset-0" style={{ backgroundColor: "#0f172a" }}>
        <View
          className="absolute -top-20 -right-20 rounded-full opacity-15"
          style={{
            width: 300,
            height: 300,
            backgroundColor: "#6366f1",
          }}
        />

        <View
          className="absolute -bottom-32 -left-32 rounded-full opacity-10"
          style={{
            width: 400,
            height: 400,
            backgroundColor: "#8b5cf6",
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          <View className="items-center mb-7">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{
                backgroundColor: "#6366f1",
                shadowColor: "#6366f1",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Text className="text-4xl font-black text-white">
                {user?.displayName?.charAt(0).toUpperCase() ??
                  user?.email?.charAt(0).toUpperCase() ??
                  "U"}
              </Text>
            </View>

            <Text className="text-2xl font-black text-white">
              {user?.displayName || "Mi perfil"}
            </Text>

            <Text className="mt-2 text-sm text-slate-400">
              Cuenta de Artesanías Inca Perú
            </Text>
          </View>

          <View
            className="rounded-[30px] p-6 mb-5"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.2)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 15,
              },
              shadowOpacity: 0.4,
              shadowRadius: 30,
              elevation: 15,
            }}
          >
            <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-5">
              Información de cuenta
            </Text>

            <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Correo electrónico
            </Text>

            <View
              className="rounded-2xl px-5 py-4 mb-5"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.15)",
              }}
            >
              <Text
                className="text-base font-semibold text-white"
                numberOfLines={1}
              >
                {user?.email ?? "Sin correo"}
              </Text>
            </View>

            <Pressable
              onPress={() => setShowPasswordModal(true)}
              className="rounded-2xl py-4"
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.25)",
              }}
            >
              <Text className="text-center text-base font-black text-indigo-300">
                🔐 Cambiar contraseña
              </Text>
            </Pressable>
          </View>

          <View
            className="rounded-[30px] p-6 mb-5"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-5">
              Mis pedidos
            </Text>

            <View className="items-center py-4">
              {loadingPedidos ? (
                <>
                  <ActivityIndicator size="small" color="#6366f1" />

                  <Text className="mt-3 text-sm text-slate-400">
                    Cargando...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-5xl font-black text-white">
                    {pedidos.length}
                  </Text>

                  <Text className="mt-2 text-sm text-slate-400">
                    {pedidos.length === 1
                      ? "Pedido Registrado"
                      : "Pedidos Registrados"}
                  </Text>
                </>
              )}
            </View>
          </View>

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            className="rounded-2xl py-4"
            style={{
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              borderWidth: 1,
              borderColor: "rgba(244, 63, 94, 0.25)",
            }}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color="#fb7185" />
            ) : (
              <Text className="text-center text-base font-black text-rose-400">
                🚪 Cerrar sesión
              </Text>
            )}
          </Pressable>

          <View className="items-center mt-6">
            <Text className="text-xs text-slate-500">Artesanías Inca Perú</Text>

            <Text className="text-xs text-slate-600 mt-1">Versión 1.0.0</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <Modal
        transparent
        visible={showPasswordModal}
        animationType="fade"
        onRequestClose={() => {
          if (!changingPassword) {
            setShowPasswordModal(false);
          }
        }}
      >
        <View
          className="flex-1 justify-center px-5"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <View
            className="rounded-[30px] p-6"
            style={{
              backgroundColor: "#1e293b",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.25)",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 20,
              },
              shadowOpacity: 0.5,
              shadowRadius: 40,
              elevation: 20,
            }}
          >
            <Text className="text-2xl font-black text-white">
              Cambiar contraseña
            </Text>

            <Text className="text-sm text-slate-400 mt-2 mb-6">
              Ingresa tu contraseña actual y establece una nueva.
            </Text>

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Contraseña actual
            </Text>

            <View
              className="flex-row items-center rounded-2xl px-4 mb-4"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                placeholder="Contraseña actual"
                placeholderTextColor="#64748b"
                className="flex-1 py-4 text-white"
                editable={!changingPassword}
              />

              <Pressable
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Text className="font-bold text-indigo-400">
                  {showCurrentPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Nueva contraseña
            </Text>

            <View
              className="flex-row items-center rounded-2xl px-4 mb-4"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#64748b"
                className="flex-1 py-4 text-white"
                editable={!changingPassword}
              />

              <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                <Text className="font-bold text-indigo-400">
                  {showNewPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Confirmar contraseña
            </Text>

            <View
              className="flex-row items-center rounded-2xl px-4 mb-6"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor="#64748b"
                className="flex-1 py-4 text-white"
                editable={!changingPassword}
              />

              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text className="font-bold text-indigo-400">
                  {showConfirmPassword ? "Ocultar" : "Ver"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleChangePassword}
              disabled={changingPassword}
              className="rounded-2xl py-4 mb-3"
              style={{
                backgroundColor: changingPassword ? "#4338ca" : "#6366f1",
                shadowColor: "#6366f1",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {changingPassword ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-center font-black text-white">
                  Cambiar contraseña
                </Text>
              )}
            </Pressable>

            <Pressable
              disabled={changingPassword}
              onPress={() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="rounded-2xl py-4"
              style={{
                backgroundColor: "rgba(148, 163, 184, 0.08)",
              }}
            >
              <Text className="text-center font-bold text-slate-400">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
