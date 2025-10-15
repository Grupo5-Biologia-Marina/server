import request from "supertest";
import { app } from "../app";
import db_connection from "../database/db_connection";

describe("Test GET CRUD", () => {
    beforeAll(async () => {
        await db_connection.authenticate();
    });

    describe("GET /get", () => {
       
        test("should return a response with status 200 and type json", async () => {
            const response = await request(app).get("/api/posts");
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toContain("json");
        });

        test("should return an array in the body", async () => {
            const response = await request(app).get("/api/posts");
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});