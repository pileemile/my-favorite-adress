import { filter, map } from './mapFilter';

describe('map', () => {
    it('calls callback the right number of times with right parameters', () => {
        const changeItemSpy = jest.fn((item: number) => item * 2);

        const result = map([1, 2, 3], changeItemSpy);

        expect(result).toEqual([2, 4, 6]);
        expect(changeItemSpy).toHaveBeenCalledTimes(3);
        expect(changeItemSpy).toHaveBeenNthCalledWith(1, 1);
        expect(changeItemSpy).toHaveBeenNthCalledWith(2, 2);
        expect(changeItemSpy).toHaveBeenNthCalledWith(3, 3);
    });

    it('returns an empty array when items is empty', () => {
        const changeItemSpy = jest.fn((item: number) => item * 10);

        const result = map([], changeItemSpy);

        expect(result).toEqual([]);
        expect(changeItemSpy).not.toHaveBeenCalled();
    });
});

describe('filter', () => {
    it('keeps only items for which callback returns true', () => {
        const keepItemSpy = jest.fn((item: number) => item > 2);

        const result = filter([1, 2, 3, 4], keepItemSpy);

        expect(result).toEqual([3, 4]);
        expect(keepItemSpy).toHaveBeenCalledTimes(4);
        expect(keepItemSpy).toHaveBeenNthCalledWith(1, 1);
        expect(keepItemSpy).toHaveBeenNthCalledWith(2, 2);
        expect(keepItemSpy).toHaveBeenNthCalledWith(3, 3);
        expect(keepItemSpy).toHaveBeenNthCalledWith(4, 4);
    });
});
