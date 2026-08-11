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

  // TODO 2:
  // Usar addDoc para crear el pedido en Firestore.
  const docRef = await addDoc(pedidosRef, pedido);

  console.log("[FIRESTORE CREATE] Pedido creado con ID:", docRef.id);
  return docRef;
};

export const getPedidosByUser = async (userId: string): Promise<Pedido[]> => {
  console.log("[FIRESTORE READ] Listando pedidos del usuario:", userId);

  // TODO 3:
  // Filtrar pedidos por userId para que cada usuario vea solo sus pedidos.
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

  // TODO 4:
  // Actualizar documento usando updateDoc.
  const pedidoDoc = doc(db, "pedidos", id);
  await updateDoc(pedidoDoc, data);

  console.log("[FIRESTORE UPDATE] Pedido actualizado:", id);
};

export const deletePedido = async (id: string) => {
  console.log("[FIRESTORE DELETE] Eliminando pedido:", id);

  // TODO 5:
  // Eliminar documento usando deleteDoc.
  const pedidoDoc = doc(db, "pedidos", id);
  await deleteDoc(pedidoDoc);

  console.log("[FIRESTORE DELETE] Pedido eliminado:", id);
};
