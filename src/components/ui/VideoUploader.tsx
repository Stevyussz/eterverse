"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { toast } from "sonner";
import { getYoutubeId } from "@/utils/youtube";

interface VideoUploaderProps {
  name: string;
  defaultValue?: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

const MAX_FILE_SIZE_MB = 100;
const MAX_DURATION_SECONDS = 60;
const ALLOWED_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_EXT_LABEL = ".mp4 / .webm";

export function VideoUploader({ name, defaultValue }: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string>(defaultValue || "");
  const [uploadState, setUploadState] = useState<UploadState>(defaultValue ? "success" : "idle");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  // Clean up XHR on unmount
  useEffect(() => {
    return () => {
      xhrRef.current?.abort();
    };
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    // ── Strict Frontend Validation ───────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Format tidak didukung. Gunakan ${ALLOWED_EXT_LABEL}.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Ukuran file terlalu besar! Maksimal ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Validate duration via HTML5 video metadata (no upload needed)
    const duration = await new Promise<number>((resolve) => {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(vid.src);
        resolve(vid.duration);
      };
      vid.onerror = () => resolve(0);
      vid.src = URL.createObjectURL(file);
    });

    if (duration > MAX_DURATION_SECONDS) {
      toast.error(
        `Durasi video terlalu panjang! Maksimal ${MAX_DURATION_SECONDS} detik (${(duration).toFixed(0)} detik terdeteksi).`
      );
      return;
    }

    setFileName(file.name);
    setUploadState("uploading");
    setProgress(0);

    try {
      // ── Step 1: Fetch signed parameters from our secure API route ─────────
      const sigRes = await fetch("/api/cloudinary/signature", {
        method: "POST",
      });
      if (!sigRes.ok) {
        throw new Error("Gagal mendapatkan izin upload. Coba login ulang.");
      }
      const sigData = await sigRes.json();

      // ── Step 2: Build FormData with signed params ─────────────────────────
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("eager", sigData.eager);
      formData.append("eager_async", sigData.eager_async);

      // ── Step 3: Upload directly from browser to Cloudinary ────────────────
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/video/upload`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // ── Cloudinary Optimization: use eager URL (f_auto, q_auto, w_720)
            // If eager not ready yet, fall back to secure_url with manual params
            const optimizedUrl =
              response.eager?.[0]?.secure_url ||
              response.secure_url.replace(
                "/upload/",
                "/upload/c_limit,w_720,f_auto,q_auto/"
              );
            setVideoUrl(optimizedUrl);
            setUploadState("success");
            toast.success("Trailer berhasil diupload! 🎬");
            resolve();
          } else {
            reject(new Error("Upload ke Cloudinary gagal."));
          }
        };

        xhr.onerror = () => reject(new Error("Terjadi kesalahan jaringan."));
        xhr.onabort = () => reject(new Error("Upload dibatalkan."));
        xhr.send(formData);
      });
    } catch (err: any) {
      console.error(err);
      setUploadState("error");
      setProgress(0);
      toast.error(err.message || "Upload gagal. Silakan coba lagi.");
    }
  }, []);

  // ── Drag & Drop Handlers ────────────────────────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only trigger if leaving the drop zone itself (not a child)
    if (e.currentTarget === e.target) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleReset = () => {
    xhrRef.current?.abort();
    setVideoUrl("");
    setUploadState("idle");
    setProgress(0);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── URL state applies to both uploaded video and YouTube fallback ───────────
  const handleYouTubeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    if (e.target.value) setUploadState("success");
    else setUploadState("idle");
  };

  const openPicker = () => uploadState !== "uploading" && fileInputRef.current?.click();

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden input carries the final URL to the parent FormData */}
      <input type="hidden" name={name} value={videoUrl} />

      {uploadState === "success" && videoUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video px-screen">
            {getYoutubeId(videoUrl) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?autoplay=0&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
                title="Preview Video"
              />
            ) : (
              <video src={videoUrl} controls preload="metadata" className="w-full h-full object-contain" />
            )}
            <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
              <span className="px-chip px-chip-prism">
                <PixelIcon name="check" size={11} /> Tersimpan
              </span>
              <button type="button" onClick={handleReset} className="px-btn px-btn-red !min-h-[32px] !min-w-[32px] !p-0" aria-label="Hapus atau ganti video">
                <PixelIcon name="close" size={12} />
              </button>
            </div>
          </div>
          <p className="text-sm text-ink-2 text-center">
            {getYoutubeId(videoUrl) ? "Trailer YouTube terhubung" : fileName || "Video Cloudinary (720p)"} · siap tampil di profil server
          </p>
        </div>
      ) : (
        <>
          <div
            role="button"
            tabIndex={uploadState === "uploading" ? -1 : 0}
            aria-label="Unggah video trailer"
            aria-busy={uploadState === "uploading"}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openPicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPicker();
              }
            }}
            className={`px-slot flex flex-col items-center justify-center p-8 min-h-[190px] select-none ${
              uploadState === "uploading" ? "cursor-wait" : isDragging ? "is-selected cursor-copy" : "cursor-pointer"
            } ${uploadState === "error" ? "!bg-redstone-l" : ""}`}
          >
            {uploadState === "uploading" ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-[260px] pointer-events-none">
                <Sprite name="film" size={40} />
                {/* Real upload progress from the XHR, drawn as an XP bar */}
                <div className="w-full flex flex-col gap-2">
                  <div className="px-bar px-bar-gold" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progres unggah">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-ink-2 truncate max-w-[180px]">{fileName}</span>
                    <span className="font-pixel text-ink tabular">{progress}%</span>
                  </div>
                </div>
                <p className="text-sm text-ink-2">Mengunggah langsung ke cloud</p>
              </div>
            ) : uploadState === "error" ? (
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <PixelIcon name="alert" size={30} className="text-redstone" />
                <p className="font-pixel text-base text-redstone">Unggah gagal</p>
                <p className="text-sm text-ink-2">Ketuk untuk coba lagi</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pointer-events-none text-center">
                <PixelIcon name="upload" size={28} className={isDragging ? "text-gold-d" : "text-ink-2"} />
                <p className="font-pixel text-base text-ink">
                  {isDragging ? "Lepaskan di sini" : "Seret video ke sini, atau ketuk untuk pilih file"}
                </p>
                <p className="text-xs text-ink-2">
                  {ALLOWED_EXT_LABEL} · maks {MAX_FILE_SIZE_MB}MB · maks {MAX_DURATION_SECONDS} detik
                </p>
              </div>
            )}

            <input
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              disabled={uploadState === "uploading"}
            />
          </div>

          {uploadState !== "uploading" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t-2 border-dashed border-ink/20" />
                <span className="text-xs text-ink-2 whitespace-nowrap">atau tempel link YouTube</span>
                <div className="flex-1 border-t-2 border-dashed border-ink/20" />
              </div>
              <div className="relative flex items-center">
                <PixelIcon name="play" size={14} className="absolute left-3.5 text-ink-2 pointer-events-none" />
                <input
                  type="url"
                  aria-label="Link YouTube trailer"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl.startsWith("http") && !videoUrl.includes("cloudinary") ? videoUrl : ""}
                  onChange={handleYouTubeInput}
                  className="px-input !pl-10"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
