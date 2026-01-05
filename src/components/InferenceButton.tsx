import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";

interface InferenceButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const InferenceButton = ({ onClick, isLoading, disabled }: InferenceButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full gradient-banana text-primary-foreground font-semibold text-lg py-6 shadow-banana hover:shadow-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5 mr-2" />
          Run Inference
        </>
      )}
    </Button>
  );
};

export default InferenceButton;
