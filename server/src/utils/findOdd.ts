export const findOdd = (numbers: number[]): number => {
    const occurrences = new Map<number, number>();

    for (const number of numbers) {
        occurrences.set(number, (occurrences.get(number) || 0) + 1);
    }

    for (const [number, count] of occurrences.entries()) {
        if (count % 2 !== 0) {
            return number;
        }
    }

    throw new Error("No number appears an odd number of times");
};
