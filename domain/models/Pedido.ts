export type PedidoEstado = "PENDIENTE" | "ENVIADO" | "ENTREGADO";

export interface Pedido {
  id?: string;
  cliente: string;
  producto: string;
  cantidad: number;
  precio: number;
  estado: PedidoEstado;
  userId: string;
  userEmail: string;
  createdAt: string;
  imagenBase64?: string;
}
