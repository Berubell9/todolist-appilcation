"use client"

export default function NewTaskForm({ form, setForm, onSubmit }) {
  return (
    // 1. เวลาผู้ใช้กดปุ่ม Add Task input → onSubmitจะทำงานไปเชื่อมกับ<NewTaskForm>ในPage.js
    <form id="new" onSubmit={onSubmit} className="border-base bg-card rounded-2xl border p-4">
      <div className="grid gap-3 md:grid-cols-2">
        {/* กรอกTitle */}
        <input
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Title"
          className="border-base bg-card rounded-xl border px-3 py-2 text-base"
        />
        {/* กรอกAssignee */}
        <input
          value={form.assignee}
          onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
          placeholder="Assignee"
          className="border-base bg-card rounded-xl border px-3 py-2 text-base"
        />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr,180px,auto]">
        {/* กรอกDescription */}
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Description"
          className="border-base bg-card rounded-xl border px-3 py-2 text-base"
        />
        {/* กรอกDate */}
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
          min={new Date().toISOString().split("T")[0]}
          className="border-base bg-card rounded-xl border px-3 py-2 text-base"
        />
        <button className="btn-primary rounded-xl px-4 py-2 hover:opacity-90">Add Task</button>
      </div>
    </form>
  )
}
