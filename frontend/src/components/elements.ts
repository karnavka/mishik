const ANIMAL_EMOJI: Record<string, string> = {
    кіт: '🐱', кот: '🐱', cat: '🐱',
    пес: '🐶', собака: '🐶', dog: '🐶',
    кролик: '🐰', rabbit: '🐰',
};

export function animalEmoji(species: string): string {
    return ANIMAL_EMOJI[species.toLowerCase()] ?? '🐾';
}

export function orgEmoji(type?: string): string {
    if (!type) return '🏠';
    const t = type.toLowerCase();
    if (t.includes('клін')) return '🏥';
    if (t.includes('фонд')) return '❤️';
    return '🏠';
}