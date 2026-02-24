import express = require("express");

export const countWordOccurrences = (text: string, word: string): number => {
    const normalizedWord = word.trim().toLowerCase();

    if (!normalizedWord) {
        return 0;
    }

    return text
        .toLowerCase()
        .split(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9]+/)
        .filter((token) => token === normalizedWord).length;
};

export const createWordCountApp = () => {
    const app = express();
    app.use(express.json());

    app.post("/occurrences", (req, res) => {
        const { text, word } = req.body as { text?: string; word?: string };

        if (typeof text !== "string" || typeof word !== "string") {
            res.status(400).json({ error: "Both 'text' and 'word' must be strings." });
            return;
        }

        res.status(200).json({
            word,
            occurrences: countWordOccurrences(text, word),
        });
    });

    return app;
};
