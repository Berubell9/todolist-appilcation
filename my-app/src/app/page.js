"use client"
import { useEffect, useMemo, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import TaskCard from "@/components/TaskCard"
import Filters from "@/components/Filters"
import NewTaskForm from "@/components/NewTaskForm"
import ThemeToggle from "@/components/ThemeToggle"

const statusLabel = { todo: "To Do", in_progress: "In Progress", done: "Done" }

export default function Page() {
  //attribute
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ status: "all", assignee: "all", q: "" })
  const [view, setView] = useState("board")
  const [form, setForm] = useState({ title: "", description: "", assignee: "", due_date: "" })
  //method
  const load = async () => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== "all"))
    ).toString()
    const url = `/api/tasks${qs ? `?${qs}` : ""}`
    const r = await fetch(url, { cache: "no-store" })
    const txt = await r.text()

    if (!r.ok) {
      console.error("GET /api/tasks failed:", r.status, txt)
      setItems([])
      return
    }
    try {
      const j = txt ? JSON.parse(txt) : []
      setItems(Array.isArray(j) ? j : [])
    } catch {
      console.error("Invalid JSON from /api/tasks:", txt)
      setItems([])
    }
  }

  // Show Response 200 on logs
  useEffect(() => {
    fetch("/api/visit")
      .then((r) => r.json())
      .then((data) => console.log("visit api:", data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    load()
  }, [filters])

    /* 3.createTaskนั้นๆ */
  const createTask = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ title: "", description: "", assignee: "", due_date: "" })
    await load()
  }
  const updateTask = async (id, payload) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
    await load()
  }
  const move = async (id, status) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    })
    await load()
  }
  const remove = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    await load()
  }
  //
  const assignees = useMemo(
    () => Array.from(new Set(items.map((i) => i.assignee).filter(Boolean))),
    [items]
  )
  const group = (status) => items.filter((i) => i.status === status)
  const counts = {
    todo: group("todo").length,
    in_progress: group("in_progress").length,
    done: group("done").length,
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result || {}
    if (!destination) return
    if (destination.droppableId !== source.droppableId)
      move(Number(draggableId), destination.droppableId)
  }
  

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 text-base sm:p-6 lg:p-8">
      {/* Header (ชิดซ้าย + ปุ่ม Toggle ขวา) */}
      <div className="border-base bg-card rounded-2xl border p-4 shadow-md sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-left">
            <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">Todo List App</h1>
            <p className="text-muted text-sm sm:text-base">
              Simplifies tasks for individuals and teams
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        assignees={assignees}
        view={view}
        setView={setView}
      />
      {/* 2.เวลามีคนกดสร้างTaskจากNewTaskForm.jsจะส่งมาfunctionนี้ */}
      <NewTaskForm form={form} setForm={setForm} onSubmit={createTask} />

      {view === "board" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {["todo", "in_progress", "done"].map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="border-base bg-card rounded-2xl border p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold">{statusLabel[col]}</div>
                      <div className="border-base bg-card rounded-full border px-2 py-0.5 text-base/80 text-xs">
                        {counts[col]}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {group(col).map((t, idx) => (
                        <Draggable draggableId={String(t.id)} index={idx} key={t.id}>
                          {(p) => (
                            <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                              <TaskCard
                                t={t}
                                onMove={move}
                                onDelete={remove}
                                onUpdate={updateTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <ul className="grid gap-3">
          {items.map((t) => (
            <li key={t.id}>
              <TaskCard t={t} onMove={move} onDelete={remove} onUpdate={updateTask} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
