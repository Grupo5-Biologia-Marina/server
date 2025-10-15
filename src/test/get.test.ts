import request from "supertest";
import { app } from "../app";
import { db_connection } from "../database/db_connection";
import { Response } from "supertest";

describe("Test GET CRUD", () => {
    beforeAll(async () => {
        await db_connection.authenticate();
    });

    describe("GET /get", () => {
        let response: Response;

        beforeEach(async () => {
            response = await request(app).get("/get");
        });

        test("should return a response with status 200 and type json", async () => {
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toContain("json");
        });

        test("should return an array in the body", async () => {
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});