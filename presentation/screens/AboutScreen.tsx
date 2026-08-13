import { Animated, ScrollView, Text, View } from "react-native";
import { useEffect, useRef } from "react";

export function AboutScreen() {
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

  return (
    <View className="flex-1">
      <View className="absolute inset-0" style={{ backgroundColor: "#0f172a" }}>
        <View
          className="absolute -top-24 -right-24 rounded-full opacity-20"
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
          padding: 24,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          <View className="items-center mb-8">
            <View
              className="w-24 h-24 rounded-[30px] items-center justify-center mb-5"
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
              <Text className="text-4xl font-black text-white">AI</Text>
            </View>

            <Text className="text-3xl font-black text-white text-center">
              Artesanías Inca Perú
            </Text>

            <Text className="text-sm text-slate-400 mt-2 tracking-wide">
              Sistema de gestión de pedidos
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
            <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">
              Sobre la aplicación
            </Text>

            <Text className="text-base text-slate-300 leading-6">
              Artesanías Inca Perú es una aplicación móvil diseñada para
              facilitar la gestión y seguimiento de pedidos de productos
              artesanales.
            </Text>

            <Text className="text-base text-slate-300 leading-6 mt-4">
              Permite consultar productos, registrar pedidos y mantener la
              información organizada de manera rápida y sencilla.
            </Text>
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
              Funcionalidades
            </Text>

            <View className="flex-row items-center mb-5">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-2xl">🛍️</Text>
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-white">
                  Productos
                </Text>
                <Text className="text-sm text-slate-400 mt-1">
                  Consulta los productos disponibles.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-5">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-2xl">📦</Text>
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-white">
                  Gestión de pedidos
                </Text>
                <Text className="text-sm text-slate-400 mt-1">
                  Registra y consulta tus pedidos.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-2xl">🔐</Text>
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-white">
                  Acceso seguro
                </Text>
                <Text className="text-sm text-slate-400 mt-1">
                  Protege tu información mediante autenticación.
                </Text>
              </View>
            </View>
          </View>

          <View
            className="rounded-[30px] p-6 mb-6"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              borderWidth: 1,
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">
              Tecnología
            </Text>

            <View className="flex-row flex-wrap">
              <View
                className="rounded-xl px-4 py-2 mr-2 mb-2"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-sm font-bold text-indigo-300">
                  React Native
                </Text>
              </View>

              <View
                className="rounded-xl px-4 py-2 mr-2 mb-2"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-sm font-bold text-indigo-300">Expo</Text>
              </View>

              <View
                className="rounded-xl px-4 py-2 mr-2 mb-2"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-sm font-bold text-indigo-300">
                  Firebase
                </Text>
              </View>

              <View
                className="rounded-xl px-4 py-2 mr-2 mb-2"
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                }}
              >
                <Text className="text-sm font-bold text-indigo-300">
                  TypeScript
                </Text>
              </View>
            </View>
          </View>

          <View className="items-center">
            <Text className="text-xs text-slate-500">Artesanías Inca Perú</Text>

            <Text className="text-xs text-slate-600 mt-1">
              Versión 1.0.0 • 2026
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
