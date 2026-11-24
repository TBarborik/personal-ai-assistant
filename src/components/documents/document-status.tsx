import { DocumentListItem } from "@/lib/db/storage";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const statuses = {
  UPLOADED: {
    label: "Nahráno",
    variant: "outline",
  },
  PROCESSING: {
    label: "Zpracování",
    variant: "secondary",
  },
  READY: {
    label: "Připraveno",
    variant: "default",
  },
  FAILED: {
    label: "Chyba",
    variant: "destructive",
  },
} as const;

type DocumentStatusProps = {
    status: DocumentListItem["status"];
    errorMessage?: DocumentListItem["errorMessage"];
}

export function DocumentStatus({status, errorMessage}: DocumentStatusProps) {
    const config = statuses[status];
    const badge = <Badge variant={config.variant}>{config.label}</Badge>;

    if (status !== "FAILED" || !errorMessage)
        return badge;

    return (
        <Tooltip>
            <TooltipTrigger render={badge} className="cursor-help" />
            <TooltipContent className="max-w-xs wrap-break-word">{errorMessage}</TooltipContent>
        </Tooltip>
    )
}