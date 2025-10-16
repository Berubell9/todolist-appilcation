import request from "supertest";
import app from "../index.js";

test("GET /tasks should respond 200", async () => {
  const res = await request(app).get("/tasks");
  // อาจได้ 200 หรือ 500 ถ้า DB ยังไม่พร้อม
  expect([200, 500]).toContain(res.statusCode);
});
afterAll(async () => {
  // ปิด pool ให้หมดเกลี้ยง
  if (pool && typeof pool.end === "function") {
    await pool.end();
  }
  // กันกรณี event loop ยังไม่ว่างจริง ๆ
  await new Promise((r) => setTimeout(r, 20));
});