const { createDefaultPreset } = require('ts-jest');

const tsJestPreset = createDefaultPreset({
    tsconfig: 'tsconfig.test.json',
});

/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    transform: {
        ...tsJestPreset.transform,
    },
};
