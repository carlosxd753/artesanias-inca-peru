import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Pedido, PedidoEstado } from "../../domain/models/Pedido";
import { logoutUser } from "../../infrastructure/services/authService";
import { pickCompressedImageAsBase64 } from "../../infrastructure/services/imagePickerService";
import {
  createPedido,
  deletePedido,
  getPedidosByUser,
  updatePedido,
} from "../../infrastructure/services/pedidosService";
import { PedidoCard } from "../components/PedidoCard";
import { useAuth } from "../context/AuthContext";

const nextStatus = (estado: PedidoEstado): PedidoEstado => {
  if (estado === "PENDIENTE") return "ENVIADO";
  if (estado === "ENVIADO") return "ENTREGADO";
  return "PENDIENTE";
};

export function HomePedidosScreen() {
  const { user } = useAuth();
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [precio, setPrecio] = useState("25");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  const loadPedidos = async () => {
    if (!user) return;

    try {
      setLoadingPedidos(true);
      console.log("[UI PEDIDOS] Cargando pedidos del UID:", user.uid);

      const data = await getPedidosByUser(user.uid);
      setPedidos(data);
    } catch (error) {
      console.log("[UI PEDIDOS] Error cargando pedidos:", error);
      Alert.alert("Firestore", "No se pudieron cargar pedidos. Revisa reglas.");
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [user?.uid]);

  const handlePickImage = async () => {
    try {
      const image = await pickCompressedImageAsBase64();
      setImageUri(image?.uri ?? null);
      setImageBase64(image?.base64 ?? null);
    } catch (error) {
      Alert.alert("Permiso requerido", "Debe permitir acceso a la galería.");
    }
  };

  const handleCreatePedido = async () => {
    if (!user) return;

    if (!cliente.trim() || !producto.trim()) {
      Alert.alert("Validación", "Ingrese cliente y producto.");
      return;
    }

    try {
      setLoading(true);

      const nuevoPedido: Pedido = {
        cliente,
        producto,
        cantidad: Number(cantidad),
        precio: Number(precio),
        estado: "PENDIENTE",
        userId: user.uid,
        userEmail: user.email ?? "sin-correo",
        createdAt: new Date().toISOString(),
      };

      if (imageBase64) {
        nuevoPedido.imagenBase64 = imageBase64;
      }

      console.log("[UI PEDIDOS] Creando pedido con userId:", user.uid);

      await createPedido(nuevoPedido);

      setCliente("");
      setProducto("");
      setCantidad("1");
      setPrecio("25");
      setImageUri(null);
      setImageBase64(null);
      await loadPedidos();
      Alert.alert(
        "Pedido creado",
        "El pedido se guardó correctamente en Firestore.",
      );
    } catch (error) {
      console.log("[UI PEDIDOS] Error creando pedido:", error);
      Alert.alert("Error", "No se pudo crear el pedido.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (pedido: Pedido) => {
    if (!pedido.id) return;
    await updatePedido(pedido.id, { estado: nextStatus(pedido.estado) });
    await loadPedidos();
  };

  const handleDelete = async (pedido: Pedido) => {
    if (!pedido.id) return;
    await deletePedido(pedido.id);
    await loadPedidos();
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="px-5 pt-14" keyboardShouldPersistTaps="handled">
        <View className="mb-5 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-extrabold tracking-[3px] text-indigo-600">
              Artesanias Inca Peru
            </Text>
            <Text className="mt-2 text-4xl font-black text-slate-900">
              Pedidos
            </Text>
            <Text className="mt-2 text-base leading-6 text-slate-500">
              Usuario: {user?.email}
            </Text>
          </View>

          <Pressable
            onPress={logoutUser}
            className="rounded-2xl bg-rose-100 px-4 py-3"
          >
            <Text className="font-black text-rose-700">Salir</Text>
          </Pressable>
        </View>

        <View className="mb-5 rounded-[28px] border border-slate-200 bg-white p-4">
          <Text className="mb-3 text-lg font-black text-slate-900">
            Nuevo pedido
          </Text>

          <TextInput
            value={cliente}
            onChangeText={setCliente}
            editable={!loading}
            placeholder="Nombre del cliente"
            className="mb-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 disabled:bg-slate-100"
          />
          <TextInput
            value={producto}
            onChangeText={setProducto}
            editable={!loading}
            placeholder="Producto"
            className="mb-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 disabled:bg-slate-100"
          />

          <View className="flex-row gap-3">
            <TextInput
              value={cantidad}
              onChangeText={setCantidad}
              editable={!loading}
              keyboardType="numeric"
              placeholder="Cantidad"
              className="mb-3 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 disabled:bg-slate-100"
            />
            <TextInput
              value={precio}
              onChangeText={setPrecio}
              editable={!loading}
              keyboardType="numeric"
              placeholder="Precio"
              className="mb-3 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 disabled:bg-slate-100"
            />
          </View>

          {imageUri ? (
            <View className="mb-3">
              <Image source={{ uri: imageUri }} className="h-32 rounded-2xl" />
              <Text className="mt-2 text-center text-xs font-bold text-emerald-700">
                Evidencia lista y comprimida en Base64
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handlePickImage}
            disabled={loading}
            className="mb-3 rounded-2xl bg-slate-100 py-3 disabled:opacity-60"
          >
            <Text className="text-center font-black text-slate-700">
              {imageUri
                ? "Cambiar evidencia Base64"
                : "Seleccionar evidencia Base64"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCreatePedido}
            disabled={loading}
            className="rounded-2xl bg-indigo-600 py-4 disabled:bg-indigo-300"
          >
            <Text className="text-center font-black text-white">
              Crear pedido
            </Text>
          </Pressable>
        </View>

        <Text className="mb-3 text-xl font-black text-slate-900">
          Mis pedidos
        </Text>

        <FlatList
          scrollEnabled={false}
          data={pedidos}
          keyExtractor={(item, index) => item.id ?? `${index}`}
          renderItem={({ item }) => (
            <PedidoCard
              pedido={item}
              onChangeStatus={() => handleChangeStatus(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          ListEmptyComponent={
            <Text className="mt-8 text-center text-slate-400">
              No hay pedidos registrados en Firestore.
            </Text>
          }
        />
      </ScrollView>

      <Modal
        transparent
        visible={loading || loadingPedidos}
        animationType="fade"
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-8">
          <View className="w-full max-w-sm items-center rounded-[28px] bg-white p-6">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="mt-4 text-xl font-black text-slate-900">
              {loading ? "Guardando pedido" : "Cargando pedidos"}
            </Text>
            <Text className="mt-2 text-center text-slate-500">
              {loading
                ? "Estamos registrando la información en Firestore."
                : "Obteniendo tus pedidos desde Firestore."}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
