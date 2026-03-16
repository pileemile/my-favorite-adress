import { describe, expect, it } from "@jest/globals";
import { findOdd } from "../src/utils/findOdd";

describe("findOdd (Codewars kata)", () => {
    it("returns number with odd occurrences for simple list", () => {
        expect(findOdd([7])).toBe(7);
    });

    it("returns number with odd occurrences in mixed list", () => {
        expect(findOdd([1, 1, 2])).toBe(2);
        expect(findOdd([0, 1, 0, 1, 0])).toBe(0);
    });

    it("throws error when there is no odd occurrence", () => {
        expect(() => findOdd([1, 1, 2, 2])).toThrow(
            "No number appears an odd number of times",
        );
    });
});
