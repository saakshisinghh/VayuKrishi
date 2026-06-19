"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  ImagePlus,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  compressImage,
  validateImageDimensions,
} from "../schemas/image-upload.schema";

interface DiseaseUploadCardProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export function DiseaseUploadCard({
  onFileSelected,
  isLoading,
}: DiseaseUploadCardProps) {
  const t = useTranslations("diseaseDetection");
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [validating, setValidating] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setValidating(true);
      setDragError(null);
      try {
        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
          setDragError(t("upload.errors.fileType"));
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setDragError(t("upload.errors.fileSize"));
          return;
        }
        const dimCheck = await validateImageDimensions(file);
        if (!dimCheck.valid) {
          setDragError(t(`upload.errors.${dimCheck.error ?? "dimension"}`));
          return;
        }
        const compressed = await compressImage(file);
        onFileSelected(compressed);
      } catch {
        setDragError(t("upload.errors.generic"));
      } finally {
        setValidating(false);
      }
    },
    [onFileSelected, t]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      multiple: false,
      disabled: isLoading || validating,
      onDrop: async ([accepted], [rejected]) => {
        if (rejected?.length) {
          setDragError(t("upload.errors.fileType"));
          return;
        }
        if (accepted) await processFile(accepted);
      },
    });

  // Camera helpers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });
      setCameraStream(stream);
      setCameraMode(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch {
      toast.error(t("upload.camera.permissionDenied"));
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraMode(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      stopCamera();
      await processFile(file);
    }, "image/jpeg");
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed border-border transition-colors">
      <AnimatePresence mode="wait">
        {/* Camera Mode */}
        {cameraMode ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center gap-4 p-4"
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-64 w-full object-cover md:h-96"
              />
              <Badge className="absolute left-3 top-3 gap-1 bg-red-500 text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                {t("upload.camera.live")}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={stopCamera}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t("upload.camera.cancel")}
              </Button>
              <Button onClick={capturePhoto} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Camera className="h-4 w-4" />
                {t("upload.camera.capture")}
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Drop Zone */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center gap-5 p-8 text-center transition-colors md:p-12 ${
                isDragActive && !isDragReject
                  ? "bg-emerald-50 dark:bg-emerald-950/30"
                  : ""
              } ${isDragReject ? "bg-red-50 dark:bg-red-950/20" : ""}`}
            >
              <input {...getInputProps()} />

              {/* Icon */}
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
                  isDragReject
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-emerald-100 dark:bg-emerald-900/30"
                }`}
              >
                {validating || isLoading ? (
                  <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
                ) : isDragReject ? (
                  <AlertCircle className="h-9 w-9 text-red-500" />
                ) : (
                  <ImagePlus className="h-9 w-9 text-emerald-600" />
                )}
              </motion.div>

              {/* Text */}
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {isDragActive
                    ? t("upload.dropHere")
                    : t("upload.dragAndDrop")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("upload.or")}{" "}
                  <span className="font-medium text-emerald-600 underline underline-offset-2">
                    {t("upload.browse")}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("upload.supportedFormats")} · {t("upload.maxSize")}
                </p>
              </div>

              {/* Format badges */}
              <div className="flex flex-wrap justify-center gap-2">
                {["JPG", "JPEG", "PNG", "WebP"].map((fmt) => (
                  <Badge
                    key={fmt}
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 "
                  >
                    {fmt}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {dragError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 border-t border-red-200 bg-red-50 px-5 py-3 dark:border-red-900 dark:bg-red-950/30"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {dragError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider + Camera button */}
            <div className="flex items-center gap-4 border-t px-6 py-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t("upload.orUse")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap justify-center gap-3 px-6 pb-6">
              <Button
                variant="outline"
                onClick={startCamera}
                disabled={isLoading || validating}
                className="gap-2"
                aria-label={t("upload.camera.open")}
              >
                <Camera className="h-4 w-4" />
                {t("upload.camera.open")}
              </Button>
              {/* Mobile native camera fallback */}
              <Button
                variant="outline"
                disabled={isLoading || validating}
                className="gap-2"
                onClick={() => cameraInputRef.current?.click()}
                aria-label={t("upload.mobileCamera")}
              >
                <Upload className="h-4 w-4" />
                {t("upload.mobileCamera")}
              </Button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await processFile(file);
                  e.target.value = "";
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
