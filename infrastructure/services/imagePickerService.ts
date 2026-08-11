import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export interface PickedImageResult {
  uri: string;
  base64: string;
}

export const pickCompressedImageAsBase64 = async (): Promise<PickedImageResult | null> => {
  console.log("[IMAGE PICKER] Solicitando permiso de galería...");

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Permiso de galería denegado");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.4,
  });

  if (result.canceled) {
    console.log("[IMAGE PICKER] Usuario canceló selección.");
    return null;
  }

  const originalUri = result.assets[0].uri;
  console.log("[IMAGE PICKER] Imagen seleccionada:", originalUri);

  // TODO 10:
  // Reducir y comprimir imagen para que entre como string Base64 en Firestore.
  console.log("[IMAGE BASE64] Imagen comprimida:")
  const manipulated = await ImageManipulator.manipulateAsync(
    originalUri,
    [{ resize: { width: 320 } }],
    {
      compress: 0.25,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true
    }
  );




  const base64 = manipulated.base64 ?? "";
  const sizeInKb = Math.round((base64.length * 3) / 4 / 1024);
  console.log("[IMAGE BASE64] Tamaño aproximado:", `${sizeInKb} KB`);

  if (sizeInKb > 700) {
    console.log("Imagen demasiado grande. Selecciona otra.");
  }

  return {
    uri: manipulated.uri,
    base64: `data:image/jpeg;base64,${base64}`,
  };
};
