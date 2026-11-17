"use client";

import { useState, useRef } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { uploadImageToImgBB } from "@/app/actions/uploadImage";
import { compressImage } from "@/lib/image-compress";

interface ImageUploaderProps {
  name: string;
  label: string;
  aspectRatio?: "square" | "video";
  onUploadSuccess?: (url: string) => void;
  defaultValue?: string;
  isGallery?: boolean;
}

export function ImageUploader({ name, label, aspectRatio = "square", onUploadSuccess, defaultValue, isGallery = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(defaultValue ? defaultValue.split(',').filter(Boolean) : []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isGallery) {
      // Handle multiple files for gallery
      const newUrls = [...galleryUrls];
      for (let i = 0; i < files.length; i++) {
        await uploadSingleFile(files[i], (url) => {
          newUrls.push(url);
          setGalleryUrls([...newUrls]); // Trigger re-render progressively
        });
      }
    } else {
      // Single file upload
      await uploadSingleFile(files[0], (url) => {
        setPreview(url);
      });
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadSingleFile = async (original: File, onSuccess: (url: string) => void) => {
    // Validate file
    if (!original.type.startsWith("image/")) {
      setError("Pilih file gambar yang valid (PNG, JPG, WEBP).");
      return;
    }

    setIsUploading(true);
    setError(null);

    const file = await compressImage(original);
    if (file.size > 4 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimum 4MB.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageToImgBB(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.url) {
        onSuccess(res.url);
        if (onUploadSuccess) onUploadSuccess(res.url);
      }
    } catch (err: any) {
      setError("Terjadi gangguan jaringan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryItem = (indexToRemove: number) => {
    const newUrls = galleryUrls.filter((_, idx) => idx !== indexToRemove);
    setGalleryUrls(newUrls);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="px-label !mb-1">{label}</span>
      
      {/* Hidden input to store the actual URL for the form submission */}
      <input type="hidden" name={name} value={isGallery ? galleryUrls.join(",") : preview} />

      {!isGallery ? (
        /* Single image: a recessed slot; tap to pick, tap again to replace. */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label={preview ? `Ganti ${label}` : `Unggah ${label}`}
          className={`px-slot relative overflow-hidden flex flex-col items-center justify-center group ${aspectRatio === "square" ? "w-28 h-28" : "w-full aspect-video max-h-48"}`}
        >
          {isUploading ? (
            <span className="flex flex-col items-center gap-2 text-ink-2">
              <PixelIcon name="refresh" size={20} className="px-spin" />
              <span className="font-pixel text-xs">Mengunggah</span>
            </span>
          ) : preview ? (
            <>
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute bottom-1.5 right-1.5 px-chip !text-xs">
                <PixelIcon name="upload" size={10} /> Ganti
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-2 text-ink-2 group-hover:text-ink">
              <PixelIcon name="upload" size={22} />
              <span className="font-pixel text-sm">Unggah</span>
            </span>
          )}
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-slot w-full py-7 flex flex-col items-center justify-center gap-2 text-ink-2 hover:text-ink"
          >
            {isUploading ? (
              <>
                <PixelIcon name="refresh" size={22} className="px-spin" />
                <span className="font-pixel text-sm">Mengunggah gambar</span>
              </>
            ) : (
              <>
                <PixelIcon name="image" size={28} />
                <span className="font-pixel text-sm text-ink">Ketuk untuk unggah screenshot</span>
                <span className="text-xs">PNG, JPG, WEBP. Foto besar otomatis diperkecil.</span>
              </>
            )}
          </button>

          {galleryUrls.length > 0 && (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryUrls.map((url, idx) => (
                <li key={idx} className="relative aspect-video px-screen">
                  <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    aria-label={`Hapus screenshot ${idx + 1}`}
                    className="absolute top-1.5 right-1.5 px-btn px-btn-red !min-h-[32px] !min-w-[32px] !p-0"
                  >
                    <PixelIcon name="close" size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-redstone text-sm mt-1 px-shake">
          <PixelIcon name="alert" size={14} />
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        multiple={isGallery}
        className="hidden" 
      />
    </div>
  );
}
