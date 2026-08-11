import { storage } from "infrastructure/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const utiToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
}

export const uploadImageToStorage = async (uri:string, pedidoId:string)=> {
    console.log("[STORAGE UPLOAD] Preparando el pedido:",  pedidoId);

    const blob = await utiToBlob(uri);
    const fileRef = ref(storage, `pedidos/${pedidoId}.jpg`);

    console.log("[STORAGE UPLOAD] Subiendo imagen a Storage...");
    await uploadBytes(fileRef, blob);

    const url = await getDownloadURL(fileRef);
    console.log("[STORAGE UPLOAD] URL de la imagen", url);
    return url;
}