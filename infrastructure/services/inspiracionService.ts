export interface Inspiracion {
  id: string;
  titulo: string;
  imagen: string;
  descripcion: string;
}

const PEXELS_API_KEY =
  "DQa2inCB01PyjYU7illZyo4wMEwaYQI5uICuleYkxoEtlzBknFI6q96z";

export const getInspiracionPeru = async (): Promise<Inspiracion[]> => {
  const query = encodeURIComponent("Peru Inca");

  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=10`;

  console.log("[API] Obteniendo inspiración...");
  console.log("[API] URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: PEXELS_API_KEY,
        Accept: "application/json",
      },
    });

    console.log("[API] Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.log("[API] Error:", errorText);

      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    console.log("[API] Fotos recibidas:", json.photos?.length ?? 0);

    const resultados: Inspiracion[] = (json.photos ?? []).map((photo: any) => ({
      id: String(photo.id),

      titulo: photo.alt || "Inspiración peruana",

      imagen: photo.src?.large || photo.src?.medium || photo.src?.original,

      descripcion: photo.photographer
        ? `Fotografía de ${photo.photographer}`
        : "Inspiración basada en la cultura y paisajes del Perú.",
    }));

    console.log("[API] Inspiraciones obtenidas:", resultados.length);

    return resultados;
  } catch (error) {
    console.log("[API] Error obteniendo inspiración:", error);

    throw error;
  }
};
