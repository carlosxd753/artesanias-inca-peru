import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Pedido, PedidoEstado } from "../../domain/models/Pedido";

import { Product } from "../../domain/models/Producto";

import {
  createPedido,
  deletePedido,
  getPedidosByUser,
  updatePedido,
} from "../../infrastructure/services/pedidosService";

import {
  getProducts,
  updateProductStock,
} from "../../infrastructure/database/productRepository";

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

  const [precio, setPrecio] = useState("0");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [productos, setProductos] = useState<Product[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Product | null>(null);

  const [showProducts, setShowProducts] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingPedidos, setLoadingPedidos] = useState(false);

  const [loadingProductos, setLoadingProductos] = useState(true);

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

  const loadProductos = async () => {
    try {
      setLoadingProductos(true);

      console.log("[SQLITE] Cargando productos locales...");

      const data = await getProducts();

      setProductos(data);

      console.log("[SQLITE] Productos disponibles:", data.length);
    } catch (error) {
      console.log("[SQLITE] Error cargando productos:", error);

      Alert.alert("SQLite", "No se pudieron cargar los productos locales.");
    } finally {
      setLoadingProductos(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      loadProductos();
    }, []),
  );

  const handleSelectProduct = (product: Product) => {
    setProductoSeleccionado(product);

    setProducto(product.name);

    setPrecio(product.price.toString());

    setCantidad("1");

    setShowProducts(false);
  };

  const handleCreatePedido = async () => {
    if (!user) return;

    if (!cliente.trim()) {
      Alert.alert("Validación", "Ingrese el nombre del cliente.");

      return;
    }

    if (!productoSeleccionado) {
      Alert.alert("Validación", "Seleccione un producto.");

      return;
    }

    const cantidadNumber = Number(cantidad);

    if (!Number.isInteger(cantidadNumber) || cantidadNumber <= 0) {
      Alert.alert("Validación", "Ingrese una cantidad válida.");

      return;
    }

    if (cantidadNumber > productoSeleccionado.stock) {
      Alert.alert(
        "Stock insuficiente",
        `Solo hay ${productoSeleccionado.stock} unidades disponibles.`,
      );

      return;
    }

    try {
      setLoading(true);

      const nuevoPedido: Pedido = {
        cliente: cliente.trim(),

        producto: productoSeleccionado.name,

        cantidad: cantidadNumber,

        precio: productoSeleccionado.price,

        estado: "PENDIENTE",

        userId: user.uid,

        userEmail: user.email ?? "sin-correo",

        createdAt: new Date().toISOString(),
      };

      console.log("[UI PEDIDOS] Creando pedido:", nuevoPedido);

      await createPedido(nuevoPedido);

      await updateProductStock(productoSeleccionado.id, cantidadNumber);

      await loadProductos();

      setCliente("");
      setProducto("");
      setCantidad("1");
      setPrecio("0");
      setProductoSeleccionado(null);

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

    await updatePedido(pedido.id, {
      estado: nextStatus(pedido.estado),
    });

    await loadPedidos();
  };

  const handleDelete = async (pedido: Pedido) => {
    if (!pedido.id) return;

    await deletePedido(pedido.id);

    await loadPedidos();
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: "#0f172a",
      }}
    >
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#0f172a",
        }}
      >
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
        className="px-5 pt-14"
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="font-extrabold tracking-[3px] text-indigo-400 mb-5">
              Artesanías Inca Perú
            </Text>

            <Text className="mt-2 text-4xl font-black text-white">Pedidos</Text>

            <Text className="mt-2 text-sm leading-6 text-slate-400">
              {user?.email}
            </Text>
          </View>
        </View>

        <View
          className="mb-6 rounded-[28px] p-5"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.85)",

            borderWidth: 1,

            borderColor: "rgba(99, 102, 241, 0.2)",

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
          <Text className="mb-4 text-lg font-black text-white">
            Nuevo pedido
          </Text>

          <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
            Cliente
          </Text>

          <TextInput
            value={cliente}
            onChangeText={setCliente}
            editable={!loading}
            placeholder="Nombre del cliente"
            placeholderTextColor="#64748b"
            className="mb-4 rounded-2xl px-4 py-3 text-white text-base"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",

              borderWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          />

          <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
            Producto
          </Text>

          <Pressable
            onPress={() => setShowProducts(true)}
            disabled={loading || loadingProductos}
            className="mb-4 rounded-2xl px-4 py-4"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",

              borderWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text
                className={
                  productoSeleccionado
                    ? "text-white text-base"
                    : "text-slate-500 text-base"
                }
              >
                {loadingProductos
                  ? "Cargando productos..."
                  : productoSeleccionado
                    ? productoSeleccionado.name
                    : "Seleccionar producto"}
              </Text>

              <Text className="text-indigo-400 font-black">▼</Text>
            </View>
          </Pressable>

          <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
            Precio
          </Text>

          <View
            className="mb-4 rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.35)",

              borderWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.15)",
            }}
          >
            <Text className="text-white text-base">
              {productoSeleccionado
                ? `S/ ${productoSeleccionado.price.toFixed(2)}`
                : "Selecciona un producto"}
            </Text>
          </View>

          <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider ml-1">
            Cantidad
          </Text>

          <TextInput
            value={cantidad}
            onChangeText={setCantidad}
            editable={!loading && !!productoSeleccionado}
            keyboardType="numeric"
            placeholder="Cantidad"
            placeholderTextColor="#64748b"
            className="mb-2 rounded-2xl px-4 py-3 text-white text-base"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",

              borderWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          />

          {productoSeleccionado && (
            <Text className="text-xs text-slate-400 mb-3 ml-1">
              Stock disponible:{" "}
              <Text className="text-indigo-300 font-bold">
                {productoSeleccionado.stock}
              </Text>
            </Text>
          )}

          <Pressable
            onPress={handleCreatePedido}
            disabled={loading || !productoSeleccionado}
            className="mt-3 rounded-2xl py-4 overflow-hidden"
            style={{
              backgroundColor:
                loading || !productoSeleccionado ? "#4338ca" : "#6366f1",

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
            <Text className="text-center font-black text-white text-base">
              Crear pedido
            </Text>
          </Pressable>
        </View>

        <Text className="mb-3 text-xl font-black text-white">Mis pedidos</Text>

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
        visible={showProducts}
        animationType="fade"
        onRequestClose={() => setShowProducts(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        >
          <View
            className="rounded-t-[32px] p-6"
            style={{
              maxHeight: "75%",

              backgroundColor: "#1e293b",

              borderTopWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.3)",
            }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <View>
                <Text className="text-2xl font-black text-white">
                  Seleccionar producto
                </Text>

                <Text className="mt-1 text-sm text-slate-400">
                  Productos almacenados localmente
                </Text>
              </View>

              <Pressable
                onPress={() => setShowProducts(false)}
                className="rounded-full px-3 py-2"
                style={{
                  backgroundColor: "rgba(148,163,184,0.1)",
                }}
              >
                <Text className="text-slate-300 font-black">✕</Text>
              </Pressable>
            </View>

            {productos.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-4xl mb-3">📦</Text>

                <Text className="text-white font-black text-lg">
                  No hay productos
                </Text>

                <Text className="text-slate-400 text-center mt-2">
                  Primero debes crear productos desde la sección Productos.
                </Text>
              </View>
            ) : (
              <FlatList
                data={productos}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectProduct(item)}
                    disabled={item.stock <= 0}
                    className="rounded-2xl p-4 mb-3"
                    style={{
                      backgroundColor:
                        item.stock <= 0
                          ? "rgba(15,23,42,0.4)"
                          : "rgba(15,23,42,0.7)",

                      borderWidth: 1,

                      borderColor: "rgba(99,102,241,0.2)",
                    }}
                  >
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-white font-black text-base">
                          {item.name}
                        </Text>

                        <Text className="text-indigo-300 text-sm mt-1">
                          {item.category}
                        </Text>
                      </View>

                      <Text className="text-indigo-400 font-black">
                        S/ {item.price.toFixed(2)}
                      </Text>
                    </View>

                    <Text className="text-slate-400 text-xs mt-3">
                      {item.stock > 0
                        ? `Stock disponible: ${item.stock}`
                        : "Sin stock"}
                    </Text>
                  </Pressable>
                )}
              />
            )}

            <Pressable
              onPress={() => setShowProducts(false)}
              className="rounded-2xl py-4 mt-3"
              style={{
                backgroundColor: "rgba(148,163,184,0.08)",
              }}
            >
              <Text className="text-center font-bold text-slate-400">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={loading || loadingPedidos}
        animationType="fade"
      >
        <View
          className="flex-1 items-center justify-center px-8"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <View
            className="w-full max-w-sm items-center rounded-[28px] p-6"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.95)",

              borderWidth: 1,

              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <ActivityIndicator size="large" color="#6366f1" />

            <Text className="mt-4 text-xl font-black text-white">
              {loading ? "Guardando pedido" : "Cargando pedidos"}
            </Text>

            <Text className="mt-2 text-center text-slate-400">
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
