import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  getInspiracionPeru,
  Inspiracion,
} from "../../infrastructure/services/inspiracionService";

export function InspiracionScreen() {
  const [imagenes, setImagenes] = useState<Inspiracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadInspiracion = async () => {
    try {
      setLoading(true);
      setError(false);

      console.log("[API] Obteniendo inspiración...");

      const data = await getInspiracionPeru();

      console.log("[API] Imágenes obtenidas:", data.length);

      if (data.length > 0) {
        console.log("[API] Primera imagen:", data[0].imagen);
      }

      setImagenes(data);
    } catch (error) {
      console.log("[API] Error obteniendo inspiración:", error);

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspiracion();
  }, []);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: "#0f172a",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 60,
          paddingBottom: 50,
        }}
      >
        <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest">
          Artesanías Inca Perú
        </Text>

        <Text className="text-4xl font-black text-white mt-3">Inspiración</Text>

        <Text className="text-sm text-slate-400 mt-2 mb-6">
          Descubre paisajes y lugares del Perú para inspirarte al crear nuevos
          productos.
        </Text>

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#6366f1" />

            <Text className="text-slate-400 mt-4">Buscando inspiración...</Text>
          </View>
        )}

        {error && !loading && (
          <View className="items-center py-10">
            <Text className="text-white font-bold text-lg text-center">
              No se pudo obtener la inspiración
            </Text>

            <Text className="text-slate-400 text-center mt-2">
              Verifica tu conexión a Internet e inténtalo nuevamente.
            </Text>

            <Pressable
              onPress={loadInspiracion}
              className="mt-5 rounded-2xl px-6 py-4"
              style={{
                backgroundColor: "#6366f1",
              }}
            >
              <Text className="text-white font-black">Reintentar</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && imagenes.length === 0 && (
          <View className="items-center py-10">
            <Text className="text-white font-bold text-lg">
              No se encontraron imágenes
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          imagenes.map((imagen) => (
            <Pressable
              key={imagen.id}
              className="mb-5 rounded-[28px] overflow-hidden"
              style={{
                backgroundColor: "#1e293b",
                borderWidth: 1,
                borderColor: "rgba(99,102,241,0.2)",
              }}
            >
              <Image
                source={{
                  uri: imagen.imagen,
                }}
                style={{
                  width: "100%",
                  height: 220,
                  backgroundColor: "#334155",
                }}
                resizeMode="cover"
                onLoad={() => {
                  console.log("[IMAGE] Cargada:", imagen.titulo);
                }}
                onError={(event) => {
                  console.log(
                    "[IMAGE] Error:",
                    imagen.titulo,
                    event.nativeEvent.error,
                  );
                }}
              />

              <View className="p-4">
                <Text
                  className="text-white font-black text-base"
                  numberOfLines={2}
                >
                  {imagen.titulo}
                </Text>

                <Text className="text-slate-400 text-sm mt-2">
                  {imagen.descripcion}
                </Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}
