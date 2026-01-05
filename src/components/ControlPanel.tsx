import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

interface ControlPanelProps {
  modelId: string;
  onModelIdChange: (value: string) => void;
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
}

const ControlPanel = ({
  modelId,
  onModelIdChange,
  confidenceThreshold,
  onConfidenceChange,
}: ControlPanelProps) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model-id" className="text-sm font-medium">
            Model ID
          </Label>
          <Input
            id="model-id"
            value={modelId}
            onChange={(e) => onModelIdChange(e.target.value)}
            placeholder="e.g., ripeness-detection_1/1"
            className="bg-secondary/50"
          />
          <p className="text-xs text-muted-foreground">
            Roboflow model identifier (project/version)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidence" className="text-sm font-medium">
              Confidence Threshold
            </Label>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
              {confidenceThreshold.toFixed(2)}
            </span>
          </div>
          <Slider
            id="confidence"
            min={0}
            max={1}
            step={0.01}
            value={[confidenceThreshold]}
            onValueChange={(values) => onConfidenceChange(values[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.00 (Show all)</span>
            <span>1.00 (Most confident)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
