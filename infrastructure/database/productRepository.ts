import { Product } from "../../domain/models/Producto";
import { dbPromise } from "./database";

export const createProduct = async (product: Omit<Product, "id">) => {
  const db = await dbPromise;

  const result = await db.runAsync(
    `
    INSERT INTO products (
      name,
      category,
      price,
      stock,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    product.name,
    product.category,
    product.price,
    product.stock,
    product.createdAt,
  );

  console.log("[SQLITE] Producto creado:", result.lastInsertRowId);

  return result.lastInsertRowId;
};

export const getProducts = async (): Promise<Product[]> => {
  const db = await dbPromise;

  const rows = await db.getAllAsync<{
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    created_at: string;
  }>(
    `
    SELECT
      id,
      name,
      category,
      price,
      stock,
      created_at
    FROM products
    ORDER BY id DESC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    createdAt: row.created_at,
  }));
};

export const updateProductStock = async (id: number, cantidad: number) => {
  const db = await dbPromise;

  await db.runAsync(
    `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ?
      AND stock >= ?
    `,
    cantidad,
    id,
    cantidad,
  );

  console.log(
    `[SQLITE] Stock descontado. Producto: ${id}, cantidad: ${cantidad}`,
  );
};

export const deleteProduct = async (id: number) => {
  const db = await dbPromise;

  await db.runAsync("DELETE FROM products WHERE id = ?", id);

  console.log("[SQLITE] Producto eliminado:", id);
};
