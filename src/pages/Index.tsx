import { useState, useCallback } from "react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import ControlPanel from "@/components/ControlPanel";
import InferenceButton from "@/components/InferenceButton";
import ImageCanvas from "@/components/ImageCanvas";
import ResultsTable from "@/components/ResultsTable";
import RawJsonPanel from "@/components/RawJsonPanel";
import ErrorAlert from "@/components/ErrorAlert";
import { Card, CardContent } from "@/components/ui/card";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

interface InferenceResponse {
  predictions?: Prediction[];
  error?: string;
  details?: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modelId, setModelId] = useState("ripeness-detection_1/1");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [rawResponse, setRawResponse] = useState<InferenceResponse | null>(null);
  const [error, setError] = useState<{ title: string; message: string; details?: string } | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPredictions([]);
    setRawResponse(null);
    setError(null);
  }, []);

  const handleRunInference = async () => {
    if (!selectedFile) {
      setError({
        title: "No Image Selected",
        message: "Please upload an image of bananas first.",
      });
      return;
    }

    if (!modelId.trim()) {
      setError({
        title: "Model ID Required",
        message: "Please enter a valid Roboflow model ID.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const base64 = await fileToBase64(selectedFile);

      // Call our edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/infer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            model_id: modelId,
          }),
        }
      );

      const data: InferenceResponse = await response.json();

      if (!response.ok) {
        setError({
          title: `API Error (${response.status})`,
          message: data.error || "Failed to process the image.",
          details: data.details,
        });
        setRawResponse(data);
        return;
      }

      setRawResponse(data);
      setPredictions(data.predictions || []);
    } catch (err) {
      setError({
        title: "Connection Error",
        message: err instanceof Error ? err.message : "Failed to connect to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 pb-12">
        <Header />

        <div className="grid gap-6 md:grid-cols-[1fr,300px] mb-6">
          <div className="space-y-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
            />
            <InferenceButton
              onClick={handleRunInference}
              isLoading={isLoading}
              disabled={!selectedFile}
            />
          </div>
          <ControlPanel
            modelId={modelId}
            onModelIdChange={setModelId}
            confidenceThreshold={confidenceThreshold}
            onConfidenceChange={setConfidenceThreshold}
          />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert
              title={error.title}
              message={error.message}
              details={error.details}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {predictions.length > 0 && previewUrl && (
          <div className="space-y-6">
            <Card className="shadow-soft overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🔍</span>
                  Detection Results
                </h3>
                <ImageCanvas
                  imageUrl={previewUrl}
                  predictions={predictions}
                  confidenceThreshold={confidenceThreshold}
                />
              </CardContent>
            </Card>

            <ResultsTable
              predictions={predictions}
              confidenceThreshold={confidenceThreshold}
            />
          </div>
        )}

        {rawResponse && (
          <div className="mt-6">
            <RawJsonPanel data={rawResponse} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
