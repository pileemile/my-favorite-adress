import { AddressInfo } from "node:net";
import { describe, expect, it, jest } from "@jest/globals";

type UserRecord = {
    id: number;
    email: string;
    hashedPassword: string;
};

const usersStore: UserRecord[] = [];
let nextUserId = 1;

const decorator = () => () => {
    return;
};

class MockBaseEntity {
    static async findOneBy(criteria: { id?: number; email?: string }) {
        if (typeof criteria.id === "number") {
            return usersStore.find((user) => user.id === criteria.id) ?? null;
        }

        if (typeof criteria.email === "string") {
            return usersStore.find((user) => user.email === criteria.email) ?? null;
        }

        return null;
    }

    async save() {
        const current = this as unknown as { id?: number; email: string; hashedPassword: string };
        const existing = usersStore.find((user) => user.email === current.email);

        if (existing) {
            const error = new Error("duplicate email");
            (error as { code?: string }).code = "SQLITE_CONSTRAINT_UNIQUE";
            throw error;
        }

        const savedUser = {
            id: nextUserId,
            email: current.email,
            hashedPassword: current.hashedPassword,
        };

        nextUserId += 1;
        usersStore.push(savedUser);

        current.id = savedUser.id;
        return this;
    }
}

class MockDataSource {
    isInitialized = false;

    constructor(_: unknown) {
        return;
    }

    async initialize() {
        this.isInitialized = true;
        return this;
    }

    async destroy() {
        this.isInitialized = false;
    }

    async query() {
        return [];
    }
}

jest.mock("typeorm", () => ({
    BaseEntity: MockBaseEntity,
    Column: decorator,
    CreateDateColumn: decorator,
    DataSource: MockDataSource,
    Entity: decorator,
    ManyToOne: decorator,
    OneToMany: decorator,
    PrimaryGeneratedColumn: decorator,
}));

import app from "./app";

type Credentials = {
    email: string;
    password: string;
};

const createCredentialsWithFaker = async (): Promise<Credentials> => {
    try {
        const fakerPkg = "@faker-js/faker";
        const fakerModule = (await import(fakerPkg)) as {
            faker: {
                internet: {
                    email: () => string;
                    password: (options: { length: number }) => string;
                };
            };
        };

        return {
            email: fakerModule.faker.internet.email(),
            password: fakerModule.faker.internet.password({ length: 16 }),
        };
    } catch {
        return {
            email: `test+${Date.now()}@test.com`,
            password: `supersecret-${Math.random().toString(36).slice(2)}`,
        };
    }
};

const startTestServer = () => {
    return app.listen(0);
};

describe("User auth flow", () => {
    const createdCredentials: Credentials = {
        email: "test@test.com",
        password: "supersecret",
    };

    let authToken = "";

    it("creates a user with test@test.com and supersecret", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdCredentials),
            });

            expect(response.status).toBe(200);
            const data = (await response.json()) as { item: { id: number; email: string; hashedPassword: string } };
            expect(data.item.email).toBe(createdCredentials.email);
            expect(data.item.hashedPassword).toBeTruthy();
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

    it("logs in the created user with POST /api/users/tokens", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users/tokens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdCredentials),
            });

            expect(response.status).toBe(200);
            const data = (await response.json()) as { token: string };
            expect(data.token).toBeTruthy();
            authToken = data.token;
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

    it("gets profile of authenticated user with GET /api/users/me", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            expect(response.status).toBe(200);
            const data = (await response.json()) as { item: { email: string } };
            expect(data.item.email).toBe(createdCredentials.email);
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

    it("creates a user with random credentials generated with faker-js", async () => {
        const randomCredentials = await createCredentialsWithFaker();

        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(randomCredentials),
            });

            expect(response.status).toBe(200);
            const data = (await response.json()) as { item: { email: string; hashedPassword: string } };
            expect(data.item.email).toBe(randomCredentials.email);
            expect(data.item.hashedPassword).toBeTruthy();
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
    it("rejects a user creation when email format is invalid", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "not-an-email",
                    password: "supersecret",
                }),
            });

            expect(response.status).toBe(400);
            const data = (await response.json()) as { message: string };
            expect(data.message).toContain("valid email");
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

    it("rejects user creation when email is already taken", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdCredentials),
            });

            expect(response.status).toBe(409);
            const data = (await response.json()) as { message: string };
            expect(data.message).toContain("already");
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

    it("checks email availability for a non-existing email", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users/email-availability?email=available%40test.com`);

            expect(response.status).toBe(200);
            const data = (await response.json()) as { available: boolean };
            expect(data.available).toBe(true);
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

    it("checks email availability for an existing email", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users/email-availability?email=test%40test.com`);

            expect(response.status).toBe(200);
            const data = (await response.json()) as { available: boolean };
            expect(data.available).toBe(false);
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

    it("returns 400 when checking email availability with an invalid email", async () => {
        const server = startTestServer();

        try {
            const { port } = server.address() as AddressInfo;
            const response = await fetch(`http://127.0.0.1:${port}/api/users/email-availability?email=wrong-email`);

            expect(response.status).toBe(400);
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
