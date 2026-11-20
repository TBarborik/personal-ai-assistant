import { ToolUIPart } from "ai";
import { getToolUiConfig } from "./tool-ui-config";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "../ui/trace";

type ToolTraceProps = {
  part: ToolUIPart;
};

export function ToolTrace({ part }: ToolTraceProps) {
  const name = part.type.slice("tool-".length);
  const config = getToolUiConfig(name);

  const Icon = config.icon;
  const Details = config.details;

  const completed = part.state === "output-available";
  const failed = part.state === "output-error";
  const running = !completed && !failed;

  const title = failed
    ? (config.failed ?? "Nástroj skončil s chybou")
    : completed
      ? config.completed
      : config.running;

  const line = (
    <TraceLine status={failed ? "error" : running ? "running" : undefined}>
      {Icon && (
        <TraceIcon>
          <Icon />
        </TraceIcon>
      )}

      <TraceTitle>{title}</TraceTitle>
    </TraceLine>
  );

  const hasDetails = completed && Details;
  const hasError = failed;

  if (!hasDetails && !hasError) {
    return <Trace>{line}</Trace>;
  }

  return (
    <Trace>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          {hasDetails && <Details input={part.input} output={part.output} />}
          {hasError && (
            <p className="text-sm text-descructive">{part.errorText ?? "Nástroj se nepodařilo dokončit."}</p>
          )}
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
