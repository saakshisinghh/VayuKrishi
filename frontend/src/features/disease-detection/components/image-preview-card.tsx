"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  Camera,
  X,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewCardProps {
  previewUrl: string;
  fileName?: string;
  fileSize?: number;
  onReplace: () => void;
  onRemove: () => void;
  onRetake?: () => void;
  onAnalyze: () => void;
  isLoading?: boolean;
}

export function ImagePreviewCard({
  previewUrl,
  fileName,
  fileSize,
  onReplace,
  onRemove,
  onRetake,
  onAnalyze,
  isLoading,
}: ImagePreviewCardProps) {
  const t = useTranslations("diseaseDetection");
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const resetZoom = () => setZoom(1);

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
          <CardTitle className="text-base font-semibold">
            {t("preview.title")}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              aria-label={t("preview.zoomOut")}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={zoomIn}
              disabled={zoom >= 3}
              aria-label={t("preview.zoomIn")}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={resetZoom}
              aria-label={t("preview.resetZoom")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFullscreen(true)}
              aria-label={t("preview.fullscreen")}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Image viewport */}
          <div className="relative h-64 w-full overflow-hidden bg-muted/40 md:h-80">
            <motion.div
              className="flex h-full w-full cursor-move items-center justify-center"
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.1}
            >
              <motion.img
                src={previewUrl}
                alt={fileName ?? t("preview.altText")}
                animate={{ scale: zoom }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="max-h-full max-w-full rounded-none object-contain"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* File info + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
            <div>
              {fileName && (
                <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
                  {fileName}
                </p>
              )}
              {fileSize && (
                <p className="text-xs text-muted-foreground">
                  {formatSize(fileSize)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {onRetake && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetake}
                  disabled={isLoading}
                  className="gap-1.5 text-xs"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {t("preview.retake")}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onReplace}
                disabled={isLoading}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {t("preview.replace")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
                disabled={isLoading}
                className="gap-1.5 text-xs text-destructive hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
                {t("preview.remove")}
              </Button>
            </div>
          </div>

          {/* Analyze CTA */}
          <div className="px-4 pb-4 pt-2">
            <Button
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={onAnalyze}
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t("preview.analyzing")}
                </>
              ) : (
                <>🔬 {t("preview.analyzeNow")}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{fileName ?? t("preview.altText")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center rounded-lg bg-muted/30 p-4">
            <img
              src={previewUrl}
              alt={fileName ?? t("preview.altText")}
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
