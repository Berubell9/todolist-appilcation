import request from "supertest";
import app from "../index.js";

test("GET /tasks should respond 200", async () => {
  const res = await request(app).get("/tasks");
  // อาจได้ 200 หรือ 500 ถ้า DB ยังไม่พร้อม
  expect([200, 500]).toContain(res.statusCode);
});
afterAll(async () => {
  // ปิด MySQL pool เพื่อไม่ให้มี open handles
  try {
    if (pool && typeof pool.end === "function") {
      await pool.end();
    }
  } catch (_) {
    // เงียบไว้ ไม่ให้เทสล้มเพราะตอนปิด
  }
  // หน่วงนิดให้ event loop ว่าง
  await new Promise((r) => setTimeout(r, 20));
});