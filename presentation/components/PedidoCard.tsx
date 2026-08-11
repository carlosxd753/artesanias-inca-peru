import { Image, Pressable, Text, View } from "react-native";
import { Pedido } from "../../domain/models/Pedido";

interface Props {
  pedido: Pedido;
  onChangeStatus: () => void;
  onDelete: () => void;
}

export function PedidoCard({ pedido, onChangeStatus, onDelete }: Props) {
  return (
    <View className="mb-3 rounded-3xl border border-slate-200 bg-white p-4">
      {pedido.imagenBase64 ? (
        <Image source={{ uri: pedido.imagenBase64 }} className="mb-3 h-36 rounded-2xl" />
      ) : null}

      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-black text-slate-900">{pedido.producto}</Text>
          <Text className="mt-1 text-slate-500">Cliente: {pedido.cliente}</Text>
          <Text className="text-slate-500">
            Cantidad: {pedido.cantidad} · S/ {pedido.precio.toFixed(2)}
          </Text>
        </View>

        <View className="rounded-full bg-indigo-100 px-3 py-1">
          <Text className="text-xs font-black text-indigo-700">{pedido.estado}</Text>
        </View>
      </View>

      <Text className="mt-3 text-xs text-slate-400">Creado por: {pedido.userEmail}</Text>

      <View className="mt-4 flex-row gap-3">
        <Pressable onPress={onChangeStatus} className="rounded-xl bg-slate-100 px-4 py-2">
          <Text className="font-bold text-slate-700">Cambiar estado</Text>
        </Pressable>
        <Pressable onPress={onDelete} className="rounded-xl bg-rose-100 px-4 py-2">
          <Text className="font-bold text-rose-700">Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}
