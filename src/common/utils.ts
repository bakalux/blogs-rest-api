export function getSkip(page: number = 1, size: number = 10): number {
    return (page - 1) * size;
}
