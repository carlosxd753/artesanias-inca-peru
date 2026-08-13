import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Pedido } from "../../domain/models/Pedido";
import { db } from "infrastructure/firebase/firebaseConfig";

const pedidosRef = collection(db, "pedidos");

export const createPedido = async (pedido: Pedido) => {
  console.log("[FIRESTORE CREATE] Creando pedido:", pedido);

  const docRef = await addDoc(pedidosRef, pedido);

  console.log("[FIRESTORE CREATE] Pedido creado con ID:", docRef.id);
  return docRef;
};

export const getPedidosByUser = async (userId: string): Promise<Pedido[]> => {
  console.log("[FIRESTORE READ] Listando pedidos del usuario:", userId);

  const q = query(pedidosRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const pedidos = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  })) as Pedido[];

  pedidos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  console.log("[FIRESTORE READ] Pedidos encontrados:", pedidos.length);
  return pedidos;
};

export const updatePedido = async (id: string, data: Partial<Pedido>) => {
  console.log("[FIRESTORE UPDATE] Actualizando pedido:", id, data);

  const pedidoDoc = doc(db, "pedidos", id);
  await updateDoc(pedidoDoc, data);

  console.log("[FIRESTORE UPDATE] Pedido actualizado:", id);
};

export const deletePedido = async (id: string) => {
  console.log("[FIRESTORE DELETE] Eliminando pedido:", id);

  const pedidoDoc = doc(db, "pedidos", id);
  await deleteDoc(pedidoDoc);

  console.log("[FIRESTORE DELETE] Pedido eliminado:", id);
};
