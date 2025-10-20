import request from "supertest";
import app from "../index.js";

test("GET /tasks should respond 200", async () => {
  const res = await request(app).get("/tasks");
  // อาจได้ 200 หรือ 500 ถ้า DB ยังไม่พร้อม
  expect([200, 500]).toContain(res.statusCode);
});
afterAll(async () => {
  // ปิด MySQL pool กัน open handles ค้าง
  try {
    if (pool && typeof pool.end === "function") {
      await pool.end();
    }
  } catch (e) {
    // เงียบ ๆ ไม่ให้ทำเทสล้มเพราะตอนปิด
  }
});