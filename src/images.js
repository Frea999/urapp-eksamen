import { supabase } from "./supabase";

const BUCKET = "design-images";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_SIDE = 1600;

// Gemmer som jpg, så telefonens GPS-data i billedet forsvinder
async function shrink(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Kunne ikke bruge billedet"))), "image/jpeg", 0.85)
  );
}

export async function uploadBackground(userId, file) {
  if (!supabase) throw new Error("Supabase er ikke sat op");
  if (!file.type.startsWith("image/")) throw new Error("Vælg et billede");
  if (file.size > MAX_FILE_SIZE) throw new Error("Billedet er for stort (højst 15 MB)");

  let blob;
  try {
    blob = await shrink(file);
  } catch {
    throw new Error("Billedet kunne ikke læses. Prøv en jpg eller png");
  }

  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw new Error("Upload mislykkedes: " + error.message);
  return path;
}

export async function downloadBackground(path) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw error;
  return data;
}

export async function removeBackground(path) {
  if (supabase && path) await supabase.storage.from(BUCKET).remove([path]);
}

export function discardUnusedBackground(path, activeImage) {
  if (path && path !== activeImage) removeBackground(path);
}
