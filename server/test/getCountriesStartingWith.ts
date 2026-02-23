import axios from "axios";

type CountryEntry = {
    country?: string;
};

type CountriesApiResponse = {
    data?: Record<string, CountryEntry>;
};

export async function getCountriesStartingWith(srch: string): Promise<string[]> {
    try {
        const { data } = await axios.get<CountriesApiResponse>(
            "https://api.first.org/data/v1/countries?limit=1000",
        );

        const normalizedSearch = srch.trim().toLowerCase();
        const countries = Object.values(data?.data ?? {})
            .map((entry) => entry.country)
            .filter((country): country is string => typeof country === "string");

        if (!normalizedSearch) {
            return countries;
        }

        return countries.filter((country) =>
            country.toLowerCase().startsWith(normalizedSearch),
        );
    } catch (err) {
        console.error("🆘 got an error:", err);
        return [];
    }
}
