import { useEffect, useRef, useState } from "react";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

interface ImageCanvasProps {
  imageUrl: string;
  predictions: Prediction[];
  confidenceThreshold: number;
}

const CLASS_COLORS: Record<string, string> = {
  overripe: "#e67e22",
  ripe: "#27ae60",
  unripe: "#3498db",
  default: "#9b59b6",
};

const ImageCanvas = ({ imageUrl, predictions, confidenceThreshold }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Calculate scale to fit container while maintaining aspect ratio
      const containerWidth = container.clientWidth;
      const maxHeight = 500;
      
      const scale = Math.min(containerWidth / img.width, maxHeight / img.height);
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      setImageDimensions({ width: displayWidth, height: displayHeight });

      // Draw image
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

      // Filter predictions by confidence threshold
      const filteredPredictions = predictions.filter(
        (p) => p.confidence >= confidenceThreshold
      );

      // Draw bounding boxes
      filteredPredictions.forEach((pred) => {
        const color = CLASS_COLORS[pred.class.toLowerCase()] || CLASS_COLORS.default;
        
        // Convert center coordinates to top-left corner
        const scaledX = (pred.x - pred.width / 2) * scale;
        const scaledY = (pred.y - pred.height / 2) * scale;
        const scaledWidth = pred.width * scale;
        const scaledHeight = pred.height * scale;

        // Draw rectangle
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        // Draw label background
        const label = `${pred.class} ${(pred.confidence * 100).toFixed(1)}%`;
        ctx.font = "bold 14px system-ui, sans-serif";
        const textMetrics = ctx.measureText(label);
        const textHeight = 20;
        const padding = 6;

        ctx.fillStyle = color;
        ctx.fillRect(
          scaledX,
          scaledY - textHeight - padding,
          textMetrics.width + padding * 2,
          textHeight + padding
        );

        // Draw label text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, scaledX + padding, scaledY - padding);
      });
    };

    img.src = imageUrl;
  }, [imageUrl, predictions, confidenceThreshold]);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-medium max-w-full"
        style={{
          width: imageDimensions.width || "auto",
          height: imageDimensions.height || "auto",
        }}
      />
    </div>
  );
};

export default ImageCanvas;
