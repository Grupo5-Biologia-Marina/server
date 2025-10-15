import { hashPassword } from "../controllers/AuthController";
import request from "supertest";
import { app } from "../app";
import db_connection from "../database/db_connection";
import { Response } from "supertest";
import UserModel from "../models/UserModel";

describe("Auth Test - Login", () => {
    beforeAll(async () => {
        await db_connection.authenticate();
        await UserModel.create({
            username: "userTest",
            email: "user@test.com",
            password: hashPassword("123456")
        })
    });

    describe("POST /login", () => {
        let response: Response;

        const credentials = {
            email: "user@test.com",
            password: "123456",
        };

        beforeEach(async () => {
            response = await request(app)
                .post("/auth/login")
                .send(credentials)
                .set("Accept", "application/json");
        });

        test("should return 200 and a JSON response", async () => {
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toContain("json");
        });

        test("should return a token in the response", async () => {
            expect(response.body).toHaveProperty("token");
            expect(typeof response.body.token).toBe("string");
        });
    });
});