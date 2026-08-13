import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Product } from "../../domain/models/Product";

import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../../infrastructure/database/productRepository";

export function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.log("[UI PRODUCTS] Error:", error);

      Alert.alert("Error", "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!name.trim()) {
      Alert.alert("Validación", "Ingrese el nombre del producto.");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Validación", "Ingrese la categoría.");
      return;
    }

    const productPrice = Number(price);
    const productStock = Number(stock);

    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      Alert.alert("Validación", "Ingrese un precio válido.");
      return;
    }

    if (!Number.isInteger(productStock) || productStock < 0) {
      Alert.alert("Validación", "Ingrese un stock válido.");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        name: name.trim(),
        category: category.trim(),
        price: productPrice,
        stock: productStock,
        createdAt: new Date().toISOString(),
      });

      setName("");
      setCategory("");
      setPrice("");
      setStock("");

      setShowModal(false);

      await loadProducts();

      Alert.alert("Producto creado", "El producto se guardó localmente.");
    } catch (error) {
      console.log("[UI PRODUCTS] Error creando producto:", error);

      Alert.alert("Error", "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (!product.id) return;

    Alert.alert("Eliminar producto", `¿Deseas eliminar "${product.name}"?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(product.id!);

            await loadProducts();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el producto.");
          }
        },
      },
    ]);
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
        className="px-5"
        contentContainerStyle={{
          paddingTop: 25,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-xs font-black text-indigo-400 uppercase tracking-[3px]">
            Artesanías Inca Perú
          </Text>

          <Text className="mt-3 text-4xl font-black text-white">Productos</Text>

          <Text className="mt-2 text-sm text-slate-400">
            Administra tu catálogo almacenado localmente.
          </Text>
        </View>

        <Pressable
          onPress={() => setShowModal(true)}
          className="rounded-2xl py-4 mb-6"
          style={{
            backgroundColor: "#6366f1",
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
          <Text className="text-center text-base font-black text-white">
            + Nuevo producto
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-black text-white">Catálogo</Text>

          <View
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: "rgba(99, 102, 241, 0.15)",
            }}
          >
            <Text className="text-xs font-black text-indigo-300">
              {products.length} productos
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#6366f1" />

            <Text className="mt-3 text-slate-400">Cargando productos...</Text>
          </View>
        ) : products.length === 0 ? (
          <View
            className="rounded-[28px] p-8 items-center"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <Text className="text-5xl mb-4">📦</Text>

            <Text className="text-lg font-black text-white">
              No hay productos
            </Text>

            <Text className="text-sm text-slate-400 text-center mt-2">
              Agrega tu primer producto al catálogo.
            </Text>
          </View>
        ) : (
          products.map((product) => (
            <View
              key={product.id}
              className="rounded-[28px] p-5 mb-4"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.85)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <View className="flex-row justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-lg font-black text-white">
                    {product.name}
                  </Text>

                  <Text className="mt-1 text-sm text-indigo-300">
                    {product.category}
                  </Text>
                </View>

                <Text className="text-xl font-black text-indigo-400">
                  S/ {product.price.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mt-5 pt-4 border-t border-slate-700/50">
                <Text className="text-sm text-slate-400">
                  Stock:{" "}
                  <Text className="font-bold text-white">{product.stock}</Text>
                </Text>

                <Pressable
                  onPress={() => handleDeleteProduct(product)}
                  className="rounded-xl px-4 py-2"
                  style={{
                    backgroundColor: "rgba(244, 63, 94, 0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(244, 63, 94, 0.2)",
                  }}
                >
                  <Text className="text-xs font-black text-rose-400">
                    Eliminar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => {
          if (!saving) {
            setShowModal(false);
          }
        }}
      >
        <View
          className="flex-1 justify-center px-5"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            className="rounded-[30px] p-6"
            style={{
              backgroundColor: "#1e293b",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.25)",
            }}
          >
            <Text className="text-2xl font-black text-white">
              Nuevo producto
            </Text>

            <Text className="mt-2 mb-6 text-sm text-slate-400">
              El producto se almacenará en SQLite.
            </Text>

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Nombre
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              editable={!saving}
              placeholder="Ej. Chullo Andino"
              placeholderTextColor="#64748b"
              className="rounded-2xl px-4 py-4 mb-4 text-white"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            />

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Categoría
            </Text>

            <TextInput
              value={category}
              onChangeText={setCategory}
              editable={!saving}
              placeholder="Ej. Ropa"
              placeholderTextColor="#64748b"
              className="rounded-2xl px-4 py-4 mb-4 text-white"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            />

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Precio
            </Text>

            <TextInput
              value={price}
              onChangeText={setPrice}
              editable={!saving}
              keyboardType="decimal-pad"
              placeholder="Ej. 35.00"
              placeholderTextColor="#64748b"
              className="rounded-2xl px-4 py-4 mb-4 text-white"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            />

            <Text className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
              Stock
            </Text>

            <TextInput
              value={stock}
              onChangeText={setStock}
              editable={!saving}
              keyboardType="numeric"
              placeholder="Ej. 10"
              placeholderTextColor="#64748b"
              className="rounded-2xl px-4 py-4 mb-6 text-white"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            />

            <Pressable
              onPress={handleCreateProduct}
              disabled={saving}
              className="rounded-2xl py-4 mb-3"
              style={{
                backgroundColor: saving ? "#4338ca" : "#6366f1",
              }}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-black text-white">
                  Guardar producto
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => setShowModal(false)}
              disabled={saving}
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
