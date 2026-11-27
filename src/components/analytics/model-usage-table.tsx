import { ModelUsage } from "@/lib/db/usage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDuration, formatNumber, formatUsd } from "@/lib/ai/analytics/format";

type ModelUsageTableProps = {
  data: ModelUsage;
};

export function ModelUsageTable({ data }: ModelUsageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Využití modelů</CardTitle>
        <CardDescription>Spotřeba, náklady a výkon jednotlivých modelů</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Požadavky</TableHead>
              <TableHead className="text-right">Tokeny</TableHead>
              <TableHead className="text-right">Náklady</TableHead>
              <TableHead className="text-right">Průměrná doba</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={`${row.provider}:${row.model}`}>
                <TableCell>
                  <div className="font-medium">{row.model}</div>
                  <div className="text-xs text-muted-foreground">{row.provider.split(".")[0]}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(row.requestCount)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(row.totalTokens)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUsd(row.costUsd)}{" "}
                  {row.pricedRequestCount < row.requestCount && (
                    <div className="text-xs text-muted-foreground">
                      {row.pricedRequestCount}/{row.requestCount} oceněno
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatDuration(row.averageDurationMs)}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Ve zvoleném období nejsou žádná data.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
