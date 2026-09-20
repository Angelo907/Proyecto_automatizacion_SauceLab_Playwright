export function parsePrice(text: string): number {
    const match = text.match(/\$([\d.]+)/);
    if (!match) {
        throw new Error(`No se pudo extraer un precio numérico del texto: "${text}"`);
    }
    return Number(match[1]);
}