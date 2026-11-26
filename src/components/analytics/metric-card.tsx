import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type MetricCardProps = {
    icon: LucideIcon;
    title: string;
    value: string;
    description?: string;
};

export function MetricCard({icon: Icon, title, value, description}: MetricCardProps) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold tracking-light tabular-nums">{value}</div>
                {description && (
                    <CardDescription className="mt- 1 text-xs">{description}</CardDescription>
                )}
            </CardContent>
        </Card>
    )
}