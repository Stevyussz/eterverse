"use client";

import { useState, useRef } from "react";
import { UploadSimple, X, CheckCircle, VideoCamera, Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";

interface VideoUploaderProps {
  name: string;
  defaultValue?: string;
}

export function VideoUploader({ name, defaultValue }: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string>(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "video/mp4") {
      toast.error("Hanya file berformat .mp4 yang diizinkan.");
      return;
    }
    
    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Ukuran file video terlalu besar! Maksimal 50MB.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Konfigurasi Cloudinary belum diatur di .env.local!");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setVideoUrl(response.secure_url);
          toast.success("Video berhasil diupload!");
        } else {
          toast.error("Gagal mengupload video.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        toast.error("Terjadi kesalahan jaringan saat upload.");
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      toast.error("Gagal mengupload video.");
    }
  };

  const removeVideo = () => {
    setVideoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden input to pass URL to form action */}
      <input type="hidden" name={name} value={videoUrl} />

      {!videoUrl ? (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed ${isUploading ? 'border-eter-cyan/50 bg-eter-cyan/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'} rounded-sm flex flex-col items-center justify-center p-8 cursor-pointer transition-all min-h-[160px] relative overflow-hidden`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4 z-10 w-full max-w-[200px]">
              <Spinner size={32} className="text-eter-cyan animate-spin" />
              <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-eter-cyan h-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <p className="text-xs font-mono text-eter-cyan">Mengunggah... {progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                <UploadSimple size={24} className="text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-eter-starlight">Pilih Video Trailer (.mp4)</p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Max 50MB</p>
            </div>
          )}
          
          <input 
            type="file" 
            accept="video/mp4" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      ) : (
        <div className="relative rounded-sm border border-white/10 overflow-hidden bg-black aspect-video group">
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-green-500/90 text-black px-2 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle size={12} weight="bold" /> Tersimpan
            </span>
            <button 
              type="button"
              onClick={removeVideo}
              className="bg-red-500/90 text-white p-1 rounded-sm hover:bg-red-500 transition-colors backdrop-blur-sm"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}
      
      {/* OR Fallback */}
      {!videoUrl && !isUploading && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">ATAU GUNAKAN LINK YOUTUBE</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <div className="flex relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <VideoCamera size={18} />
            </div>
            <input 
              type="url" 
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
