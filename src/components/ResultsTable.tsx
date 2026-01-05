import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

interface ResultsTableProps {
  predictions: Prediction[];
  confidenceThreshold: number;
}

const getClassVariant = (className: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (className.toLowerCase()) {
    case "ripe":
      return "default";
    case "overripe":
      return "destructive";
    case "unripe":
      return "secondary";
    default:
      return "outline";
  }
};

const ResultsTable = ({ predictions, confidenceThreshold }: ResultsTableProps) => {
  const filteredPredictions = predictions
    .filter((p) => p.confidence >= confidenceThreshold)
    .sort((a, b) => b.confidence - a.confidence);

  if (filteredPredictions.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No predictions above the confidence threshold ({(confidenceThreshold * 100).toFixed(0)}%)
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          Detection Results
          <Badge variant="secondary" className="ml-auto">
            {filteredPredictions.length} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
              <TableHead className="text-right">Position (x, y)</TableHead>
              <TableHead className="text-right">Size (w × h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPredictions.map((pred, index) => (
              <TableRow key={index} className="hover:bg-secondary/30">
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Badge variant={getClassVariant(pred.class)}>
                    {pred.class}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className="text-success font-semibold">
                    {(pred.confidence * 100).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  ({Math.round(pred.x)}, {Math.round(pred.y)})
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {Math.round(pred.width)} × {Math.round(pred.height)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
