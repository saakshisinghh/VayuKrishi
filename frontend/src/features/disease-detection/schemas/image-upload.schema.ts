import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_DIMENSION = 224; // px
const MAX_DIMENSION = 4096; // px
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const imageUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "validation.file.required" })
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type),
      { message: "validation.file.type" }
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      { message: "validation.file.size" }
    ),
  cropType: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;

export function validateImageDimensions(
  file: File
): Promise<{ valid: boolean; width: number; height: number; error?: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: width, naturalHeight: height } = img;
      if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
        resolve({ valid: false, width, height, error: "validation.image.tooSmall" });
      } else if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        resolve({ valid: false, width, height, error: "validation.image.tooBig" });
      } else {
        resolve({ valid: true, width, height });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, width: 0, height: 0, error: "validation.image.corrupt" });
    };
    img.src = url;
  });
}

export async function compressImage(
  file: File,
  maxSizeMB = 2,
  quality = 0.85
): Promise<File> {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { naturalWidth: w, naturalHeight: h } = img;
      const maxPx = 1920;
      if (w > maxPx || h > maxPx) {
        const ratio = Math.min(maxPx / w, maxPx / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.src = url;
  });
}

export const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
export const ACCEPTED_MIME_TYPES = ACCEPTED_TYPES;
export { MAX_FILE_SIZE, MIN_DIMENSION };
