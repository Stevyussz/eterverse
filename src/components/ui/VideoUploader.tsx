"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  UploadSimple,
  X,
  CheckCircle,
  VideoCamera,
  FilmSlate,
  Warning,
} from "@phosphor-icons/react";
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

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden input carries the final URL to the parent FormData */}
      <input type="hidden" name={name} value={videoUrl} />

      {/* ── PREVIEW STATE ──────────────────────────────────────────────────── */}
      {uploadState === "success" && videoUrl ? (
        <div className="flex flex-col gap-3">
          <div className="relative rounded-sm border border-white/10 bg-black overflow-hidden aspect-video group">
            {getYoutubeId(videoUrl) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?autoplay=0&rel=0`}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
                title="Preview Video"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
              <span className="bg-green-500/90 text-black px-2 py-1 rounded-sm text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm shadow-lg">
                <CheckCircle size={11} weight="fill" /> Tersimpan
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="bg-black/80 text-white p-1.5 rounded-sm hover:bg-red-500/80 transition-colors backdrop-blur-sm border border-white/10"
                title="Hapus / Ganti video"
              >
                <X size={13} weight="bold" />
              </button>
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 text-center">
            {getYoutubeId(videoUrl)
              ? "YouTube Trailer Terhubung"
              : fileName || "Video Cloudinary (720p dioptimasi)"} · Siap ditampilkan di profil server
          </p>
        </div>
      ) : (
        <>
          {/* ── DROP ZONE ─────────────────────────────────────────────────── */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() =>
              uploadState !== "uploading" && fileInputRef.current?.click()
            }
            className={[
              "border-2 border-dashed rounded-sm flex flex-col items-center justify-center p-8 min-h-[180px] relative overflow-hidden transition-all duration-200 select-none",
              uploadState === "uploading"
                ? "border-eter-cyan/60 bg-eter-cyan/5 cursor-wait"
                : isDragging
                ? "border-eter-cyan bg-eter-cyan/10 cursor-copy scale-[1.01] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                : uploadState === "error"
                ? "border-red-500/40 bg-red-500/5 cursor-pointer hover:border-red-400/60"
                : "border-white/10 bg-white/[0.01] cursor-pointer hover:border-white/25 hover:bg-white/[0.03]",
            ].join(" ")}
          >
            {uploadState === "uploading" ? (
              // ── UPLOADING STATE ────────────────────────────────────────────
              <div className="flex flex-col items-center gap-4 w-full max-w-[220px] pointer-events-none">
                <div className="relative">
                  <FilmSlate
                    size={36}
                    className="text-eter-cyan animate-pulse"
                  />
                </div>
                <div className="w-full flex flex-col gap-1.5">
                  <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-eter-cyan to-cyan-300 h-full rounded-full transition-all duration-300 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_1.5s_infinite]" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-mono text-zinc-400 truncate max-w-[160px]">
                      {fileName}
                    </p>
                    <p className="text-[10px] font-mono text-eter-cyan font-bold">
                      {progress}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400">
                  Mengupload langsung ke cloud...
                </p>
              </div>
            ) : uploadState === "error" ? (
              // ── ERROR STATE ────────────────────────────────────────────────
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <Warning size={32} className="text-red-400" weight="fill" />
                <p className="text-sm font-medium text-red-400">
                  Upload Gagal
                </p>
                <p className="text-xs text-zinc-500">
                  Klik untuk coba lagi
                </p>
              </div>
            ) : (
              // ── IDLE / DRAG STATE ──────────────────────────────────────────
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <div
                  className={[
                    "w-14 h-14 rounded-sm flex items-center justify-center transition-all duration-200",
                    isDragging
                      ? "bg-eter-cyan/20 border border-eter-cyan/40"
                      : "bg-white/5 border border-white/10",
                  ].join(" ")}
                >
                  <UploadSimple
                    size={26}
                    className={isDragging ? "text-eter-cyan" : "text-zinc-400"}
                    weight={isDragging ? "bold" : "regular"}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-eter-starlight">
                    {isDragging ? (
                      <span className="text-eter-cyan">Lepaskan di sini!</span>
                    ) : (
                      <>
                        Seret & Lepas video, atau{" "}
                        <span className="text-eter-cyan underline underline-offset-2">
                          pilih file
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">
                    {ALLOWED_EXT_LABEL} · Maks {MAX_FILE_SIZE_MB}MB · Maks {MAX_DURATION_SECONDS}dtk
                  </p>
                </div>
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

          {/* ── YOUTUBE FALLBACK ──────────────────────────────────────────── */}
          {uploadState !== "uploading" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-px bg-white/8 flex-1" />
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                  atau tempel link YouTube
                </span>
                <div className="h-px bg-white/8 flex-1" />
              </div>
              <div className="relative flex items-center">
                <VideoCamera
                  size={16}
                  className="absolute left-3 text-zinc-600 pointer-events-none"
                />
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl.startsWith("http") && !videoUrl.includes("cloudinary") ? videoUrl : ""}
                  onChange={handleYouTubeInput}
                  className="w-full bg-black/30 border border-white/8 rounded-sm pl-9 pr-4 py-2 text-xs text-eter-starlight placeholder:text-zinc-600 focus:border-eter-cyan/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
