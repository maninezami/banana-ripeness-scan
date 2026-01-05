import { useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedFile: File | null;
  previewUrl: string | null;
}

const ImageUploader = ({ onImageSelect, selectedFile, previewUrl }: ImageUploaderProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <Card className="shadow-soft border-2 border-dashed border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
            {previewUrl ? (
              <div className="relative w-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg shadow-medium object-contain"
                />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {selectedFile?.name}
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Drop your banana image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
                  <span>Supports JPG, PNG, WebP</span>
                </div>
              </>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
