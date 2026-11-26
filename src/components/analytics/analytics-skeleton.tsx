import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AnalyticsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({length: 6}, (_, idx) => (
                <Card key={idx} className="gap-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="size-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-3 w-36" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}