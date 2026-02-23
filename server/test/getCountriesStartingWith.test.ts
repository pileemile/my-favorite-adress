import axios from "axios";
import { getCountriesStartingWith } from "./getCountriesStartingWith";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getCountriesStartingWith", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns countries whose names start with the search string", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                data: {
                    FR: { country: "France" },
                    FI: { country: "Finland" },
                    DE: { country: "Germany" },
                },
            },
        });

        const result = await getCountriesStartingWith("fi");

        expect(result).toEqual(["Finland"]);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            "https://api.first.org/data/v1/countries?limit=1000",
        );
    });

    it("returns all countries when search is empty", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                data: {
                    FR: { country: "France" },
                    ES: { country: "Spain" },
                },
            },
        });

        const result = await getCountriesStartingWith("   ");

        expect(result).toEqual(["France", "Spain"]);
    });

    it("returns an empty array when the API call fails", async () => {
        mockedAxios.get.mockRejectedValue(new Error("network error"));

        const result = await getCountriesStartingWith("fr");

        expect(result).toEqual([]);
    });
});
