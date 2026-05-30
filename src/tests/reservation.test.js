const request = require("supertest");
const app = require("../../src/app");

describe("Reservations API", () => {
  let token;

  beforeAll(async () => {
    const email = `res_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({ name: "Res User", email, password: "password123" });
    const res = await request(app).post("/auth/login").send({ email, password: "password123" });
    token = res.body.token;
  });

  test("POST /salons/:id/reservations - pa token kthen 401", async () => {
    const res = await request(app).post("/salons/1/reservations").send({});
    expect(res.statusCode).toBe(401);
  });

  test("GET /salons/:id/reservations/my-bookings - me token kthen 200", async () => {
    const salons = await request(app).get("/salons");
    if (salons.body.length === 0) return;
    const id = salons.body[0].id;
    const res = await request(app)
      .get(`/salons/${id}/reservations/my-bookings`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST rezervim me të dhëna të mangëta kthen 400", async () => {
    const salons = await request(app).get("/salons");
    if (salons.body.length === 0) return;
    const id = salons.body[0].id;
    const res = await request(app)
      .post(`/salons/${id}/reservations`)
      .set("Authorization", `Bearer ${token}`)
      .send({ employeeId: 1 });
    expect(res.statusCode).toBe(400);
  });
});
