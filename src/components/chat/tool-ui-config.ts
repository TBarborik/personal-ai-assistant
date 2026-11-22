import { Clock, CloudSun, FileSearch, Globe, LucideIcon, MapPinSearch, Wrench } from "lucide-react";
import { ComponentType } from "react";
import { WebSearchDetails } from "./tool-details/web-search-details";

export type ToolDetailsProps = {
  input?: unknown;
  output?: unknown;
}

export type ToolUiConfig = {
  icon: LucideIcon,
  running: string;
  completed: string;
  failed?: string;
  details?: ComponentType<ToolDetailsProps>
}

export const toolConfig = {
  getCurrentTime: {
    icon: Clock,
    running: "Zjišťuji čas...",
    completed: "Čas zjištěn",
    failed: "Nepodařilo se zjistit čas"
  },
  webSearch: {
    icon: Globe,
    running: "Prohledávám web...",
    completed: "Web prohledán",
    failed: "Nepodařilo se prohledat wen",
    details: WebSearchDetails
  },
  searchDocuments: {
    icon: FileSearch,
    running: "Prohledávám dokumenty...",
    completed: "Dokumenty prohledány",
    failed: "Nepodařilo se prohledat dokumenty"
  },
  currentWeather: {
    icon: CloudSun,
    running: "Zjisťuji počasí...",
    completed: "Počasí zjištěno",
    failed: "Nepodařilo se zjistit počasí"
  },
  ipLocationData: {
    icon: MapPinSearch,
    running: "Získávám lokalizační data...",
    completed: "Lokalizace zjištěna",
    failed: "Nepodařilo získat lokalizační data"
  }
} satisfies Record<string, ToolUiConfig>

export function getToolUiConfig(name: string): ToolUiConfig {
    return (
        toolConfig[name as keyof typeof toolConfig] ?? {
            icon: Wrench,
            running: `Spouštím ${name}...`,
            completed: `${name} dokončen`
        }
    )
}