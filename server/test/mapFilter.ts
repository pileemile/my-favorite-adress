export function map(items: any[], changeItem: (item: any) => any): any[] {
    const result: any[] = [];

    for (let i = 0; i < items.length; i += 1) {
        result[result.length] = changeItem(items[i]);
    }

    return result;
}

export function filter(items: any[], keepItem: (item: any) => boolean): any[] {
    const result: any[] = [];

    for (let i = 0; i < items.length; i += 1) {
        if (keepItem(items[i])) {
            result[result.length] = items[i];
        }
    }

    return result;
}
