type ChunkOptions = {
    chunkSize: number;
    overlap: number;
}

export type TextChunk = {
    position: number;
    content: string
}

const DEFAULT_OPTIONS: ChunkOptions = {
    chunkSize: 1_200,
    overlap: 200
}

export function chunkText(text: string, options: Partial<ChunkOptions> = {}): TextChunk[] {
    const {chunkSize, overlap} = {...DEFAULT_OPTIONS, ...options};

    if (!Number.isInteger(chunkSize) || !Number.isInteger(overlap) || chunkSize <= 0 || overlap < 0 || overlap >= chunkSize) {
        throw new Error("Invalid chunk configuration.")
    }

    const chunks: TextChunk[] = [];
    let start = 0;

    while (start < text.length) {
        let end = Math.min(start + chunkSize, text.length)
        const boundary = fitBoundary(
            text, start, end, Math.max(overlap + 1, Math.floor(chunkSize * 0.6))
        )
        
        if (boundary !== -1)
            end = boundary

        let content = text.slice(start, end).trim();

        if (content.length > 0) {
            chunks.push({
                position: chunks.length,
                content: content
            })
        }

        if (end >= text.length) break;
        start = Math.max(start + 1, end - overlap)
    }

    return chunks;
}

function fitBoundary(text: string, start: number, end: number, minSize: number): number {
    const window = text.slice(start, end);
    const separators = ["\n\n", "\n", " "];
    for (const separator of separators) {
        const index = window.lastIndexOf(separator);
        if (index >= minSize) {
            return start + index + separator.length;
        }
    }

    return -1;
}