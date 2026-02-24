import { AddressInfo } from "node:net";
import { createWordCountApp } from "./wordCountApi";

describe("POST /occurrences", () => {
    it("returns the number of occurrences for a given word", async () => {
        const app = createWordCountApp();
        const server = app.listen(0);

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/occurrences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: "Bonjour monde. Bonjour à tous, bonjour encore.",
                    word: "bonjour",
                }),
            });

            expect(response.status).toBe(200);
            await expect(response.json()).resolves.toEqual({
                word: "bonjour",
                occurrences: 3,
            });
        } finally {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        }
    });
});
