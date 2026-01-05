import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title: string;
  message: string;
  details?: string;
  onDismiss: () => void;
}

const ErrorAlert = ({ title, message, details, onDismiss }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="pr-8">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {details && (
          <pre className="mt-2 text-xs bg-destructive/10 p-2 rounded overflow-x-auto">
            {details}
          </pre>
        )}
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default ErrorAlert;
