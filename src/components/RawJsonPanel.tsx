import { useState } from "react";
import { ChevronDown, ChevronRight, Code2, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RawJsonPanelProps {
  data: unknown;
}

const RawJsonPanel = ({ data }: RawJsonPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader
        className="pb-0 cursor-pointer select-none hover:bg-secondary/30 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-primary" />
          ) : (
            <ChevronRight className="w-5 h-5 text-primary" />
          )}
          <Code2 className="w-5 h-5 text-primary" />
          Raw JSON Response
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground max-h-96">
              {jsonString}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RawJsonPanel;
