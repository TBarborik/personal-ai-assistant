"use client";

import { modelCatalog, ModelId } from "@/lib/ai/model-catalog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type ModelSelectProps = {
    value: ModelId,
    onChange: (value: ModelId) => void;
    disabled?: boolean;
}

const options = Object.entries(modelCatalog).map(([key, value]) => ({label: value.label, value: value.provider}))

export function ModelSelect({
    value,
    onChange,
    disabled
}: ModelSelectProps) {
    return (
        <Select
            items={options}
            value={value}
            disabled={disabled}
            onValueChange={(value) => {
                if (value !== null)
                    onChange(value)
            }}
        >
            <SelectTrigger className="w-36" aria-label="Vybrat AI model"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}