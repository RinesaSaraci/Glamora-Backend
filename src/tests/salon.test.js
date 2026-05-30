const request = require("supertest");
const app = require("../../src/app");

describe("Salons API", () => {
  test("GET /salons - kthen listën e saloneve", async () => {
    const res = await request(app).get("/salons");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /salons?search=a - filtrim me search", async () => {
    const res = await request(app).get("/salons?search=a");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /salons/:id - salon ekzistues kthen 200", async () => {
    const salons = await request(app).get("/salons");
    if (salons.body.length === 0) return;
    const id = salons.body[0].id;
    const res = await request(app).get(`/salons/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", id);
  });

  test("POST /salons - pa token kthen 401", async () => {
    const res = await request(app).post("/salons").send({ name: "Test Salon", city: "Prishtinë" });
    expect(res.statusCode).toBe(401);
  });

  test("GET /salons/:salonId/services - kthen shërbimet", async () => {
    const salons = await request(app).get("/salons");
    if (salons.body.length === 0) return;
    const id = salons.body[0].id;
    const res = await request(app).get(`/salons/${id}/services`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /salons/:salonId/employees - kthen punonjësit", async () => {
    const salons = await request(app).get("/salons");
    if (salons.body.length === 0) return;
    const id = salons.body[0].id;
    const res = await request(app).get(`/salons/${id}/employees`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
