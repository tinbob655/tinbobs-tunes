export default function parseDate(str: string): number {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(2000 + year, month - 1, day).getTime();
}