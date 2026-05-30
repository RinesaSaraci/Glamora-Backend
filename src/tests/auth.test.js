const request = require("supertest");
const app = require("../../src/app");

describe("Auth API", () => {
  test("POST /auth/register - regjistrim i suksesshëm", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: `test_${Date.now()}@test.com`,
        password: "password123",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  test("POST /auth/register - email ekzistues kthen 400", async () => {
    const email = `dup_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({ name: "A", email, password: "pass123" });
    const res = await request(app).post("/auth/register").send({ name: "B", email, password: "pass123" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /auth/login - login i suksesshëm kthen token", async () => {
    const email = `login_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({ name: "Login User", email, password: "password123" });
    const res = await request(app).post("/auth/login").send({ email, password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /auth/login - password gabim kthen 400", async () => {
    const email = `wrong_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({ name: "Wrong User", email, password: "password123" });
    const res = await request(app).post("/auth/login").send({ email, password: "gabim" });
    expect(res.statusCode).toBe(400);
  });

  test("GET /auth/profile - pa token kthen 401", async () => {
    const res = await request(app).get("/auth/profile");
    expect(res.statusCode).toBe(401);
  });

  test("GET /auth/profile - me token korrekt kthen userin", async () => {
    const email = `profile_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({ name: "Profile User", email, password: "password123" });
    const loginRes = await request(app).post("/auth/login").send({ email, password: "password123" });
    const token = loginRes.body.token;

    const res = await request(app).get("/auth/profile").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("email", email);
  });
});
