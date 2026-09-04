"use client";

import { useState, useRef } from "react";
import { UploadSimple, Spinner, CheckCircle, WarningCircle, Image as ImageIcon, X } from "@phosphor-icons/react";
import { uploadImageToImgBB } from "@/app/actions/uploadImage";

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

  const uploadSingleFile = async (file: File, onSuccess: (url: string) => void) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("File is too large. Maximum size is 4MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

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
      setError("Network error occurred during upload.");
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
      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{label}</label>
      
      {/* Hidden input to store the actual URL for the form submission */}
      <input type="hidden" name={name} value={isGallery ? galleryUrls.join(",") : preview} />

      {!isGallery ? (
        /* SINGLE IMAGE UPLOADER */
        <div className="flex items-end gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer transition-all duration-smooth group
              ${preview ? 'border-white/10 bg-black/50' : 'border-eter-cyan/30 bg-eter-cyan/5 hover:border-eter-cyan hover:bg-eter-cyan/10'}
              ${aspectRatio === 'square' ? 'w-24 h-24' : 'w-full h-32'}
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-eter-cyan">
                <Spinner size={24} className="animate-spin" />
                <span className="text-[10px] font-medium font-mono uppercase">Uploading...</span>
              </div>
            ) : preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadSimple size={24} className="text-white drop-shadow-md" weight="bold" />
                  <span className="text-xs font-semibold text-white drop-shadow-md mt-1">Change</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-eter-cyan/70 group-hover:text-eter-cyan transition-colors">
                <UploadSimple size={24} />
                <span className="text-[10px] font-mono uppercase tracking-wider mt-2">Upload</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MULTIPLE GALLERY UPLOADER */
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`w-full py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-all duration-smooth ${isUploading ? 'border-zinc-700 bg-zinc-900 cursor-not-allowed opacity-50' : 'cursor-pointer border-eter-cyan/30 bg-eter-cyan/5 hover:border-eter-cyan hover:bg-eter-cyan/10'}`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-eter-cyan">
                <Spinner size={24} className="animate-spin" />
                <span className="text-[10px] font-medium font-mono uppercase">Uploading Image...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-eter-cyan/70">
                <ImageIcon size={32} />
                <span className="text-[10px] font-mono uppercase tracking-wider mt-2">Click to Upload Screenshots</span>
                <span className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
              </div>
            )}
          </div>

          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {galleryUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-black/50 border border-white/10 group">
                  <img src={url} alt={`Gallery item ${idx+1}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-eter-red mt-1">
          <WarningCircle size={14} />
          <span className="text-xs">{error}</span>
        </div>
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
