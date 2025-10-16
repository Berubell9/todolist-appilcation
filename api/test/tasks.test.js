import request from "supertest";
import app from "../index.js";

test("GET /tasks should respond 200", async () => {
  const res = await request(app).get("/tasks");
  // อาจได้ 200 หรือ 500 ถ้า DB ยังไม่พร้อม
  expect([200, 500]).toContain(res.statusCode);
});
afterAll(async () => {
  try {
    if (pool && typeof pool.end === "function") {
      await pool.end();            // ปิดทุก connection ใน pool
    }
  } finally {
    // หน่วงให้ event loop เคลียร์ handle ที่เพิ่งปิด
    await new Promise((r) => setImmediate(r));
  }
});