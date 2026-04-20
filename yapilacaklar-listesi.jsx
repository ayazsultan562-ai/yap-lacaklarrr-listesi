import { useState, useEffect } from "react";

const STORAGE_KEY = "todos-data";

const categories = [
  { id: "all", label: "Tümü", icon: "◉" },
  { id: "personal", label: "Kişisel", icon: "◈", color: "#E8B4B8" },
  { id: "work", label: "İş", icon: "◆", color: "#7BA7BC" },
  { id: "shopping", label: "Alışveriş", icon: "◇", color: "#B8D4A3" },
  { id: "health", label: "Sağlık", icon: "♡", color: "#D4A3D4" },
];

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("personal");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      done: false,
      category: selectedCategory,
      createdAt: new Date().toLocaleDateString("tr-TR"),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t))
    );
    setEditingId(null);
    setEditText("");
  };

  const filtered =
    activeCategory === "all"
      ? todos
      : todos.filter((t) => t.category === activeCategory);

  const doneCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  const getCatColor = (catId) =>
    categories.find((c) => c.id === catId)?.color || "#ccc";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
        fontFamily: "'Crimson Pro', 'Georgia', serif",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .todo-container {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? "0" : "30px"});
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .header-title {
          font-family: 'Crimson Pro', serif;
          font-size: 42px;
          font-weight: 300;
          color: #e0d5c1;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .header-sub {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: #6b7a99;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .progress-bar-container {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 10px;
          margin-bottom: 28px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #E8B4B8, #7BA7BC, #B8D4A3);
          border-radius: 10px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          color: #5a6a88;
          letter-spacing: 2px;
        }

        .category-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cat-btn {
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cat-btn.active {
          background: rgba(255,255,255,0.12);
          color: #e0d5c1;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }

        .cat-btn.inactive {
          background: rgba(255,255,255,0.03);
          color: #4a5a78;
        }

        .cat-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #c0b5a1;
        }

        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .todo-input {
          flex: 1;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          color: #d5cbb8;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .todo-input:focus {
          border-color: rgba(232, 180, 184, 0.3);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 20px rgba(232, 180, 184, 0.05);
        }

        .todo-input::placeholder {
          color: #3a4a68;
        }

        .add-btn {
          padding: 14px 22px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(232,180,184,0.2), rgba(123,167,188,0.2));
          color: #c0b5a1;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .add-btn:hover {
          background: linear-gradient(135deg, rgba(232,180,184,0.3), rgba(123,167,188,0.3));
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .cat-select-row {
          display: flex;
          gap: 6px;
          margin-bottom: 28px;
          align-items: center;
        }

        .cat-select-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          color: #4a5a78;
          letter-spacing: 2px;
          margin-right: 4px;
        }

        .cat-pill {
          border: none;
          padding: 5px 12px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          transition: all 0.3s ease;
        }

        .todo-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.35s ease;
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .todo-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          font-size: 10px;
        }

        .checkbox:hover {
          border-color: rgba(255,255,255,0.3);
        }

        .checkbox.checked {
          border-color: transparent;
          background: linear-gradient(135deg, rgba(184,212,163,0.6), rgba(123,167,188,0.6));
        }

        .todo-text {
          flex: 1;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #c0b5a1;
          transition: all 0.3s ease;
          line-height: 1.4;
        }

        .todo-text.done {
          text-decoration: line-through;
          color: #3a4a68;
        }

        .todo-date {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          color: #3a4a68;
          letter-spacing: 1px;
        }

        .cat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .action-btn {
          border: none;
          background: transparent;
          color: #3a4a68;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          transition: all 0.3s ease;
          border-radius: 6px;
        }

        .action-btn:hover {
          color: #c0b5a1;
          background: rgba(255,255,255,0.05);
        }

        .action-btn.delete:hover {
          color: #E8B4B8;
        }

        .edit-input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          color: #d5cbb8;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #3a4a68;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.3;
        }
      `}</style>

      <div className="todo-container">
        <div className="header-title">Yapılacaklar</div>
        <div className="header-sub">Günlük Planlayıcı</div>

        <div className="stats-row">
          <span>
            {doneCount} / {totalCount} TAMAMLANDI
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? "active" : "inactive"}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              {cat.label}
              {cat.id !== "all" && (
                <span style={{ opacity: 0.5 }}>
                  {todos.filter((t) => t.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="input-row">
          <input
            className="todo-input"
            type="text"
            placeholder="Yeni görev ekle..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="add-btn" onClick={addTodo}>
            Ekle
          </button>
        </div>

        <div className="cat-select-row">
          <span className="cat-select-label">KATEGORİ:</span>
          {categories
            .filter((c) => c.id !== "all")
            .map((cat) => (
              <button
                key={cat.id}
                className="cat-pill"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background:
                    selectedCategory === cat.id
                      ? `${cat.color}22`
                      : "rgba(255,255,255,0.03)",
                  color:
                    selectedCategory === cat.id ? cat.color : "#4a5a78",
                  border:
                    selectedCategory === cat.id
                      ? `1px solid ${cat.color}44`
                      : "1px solid transparent",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
        </div>

        <div className="todo-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <div>Henüz görev eklenmedi</div>
              <div style={{ opacity: 0.5, marginTop: 8, fontSize: 12 }}>
                Yukarıdan yeni bir görev ekleyin
              </div>
            </div>
          ) : (
            filtered.map((todo) => (
              <div className="todo-item" key={todo.id}>
                <div
                  className={`checkbox ${todo.done ? "checked" : ""}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.done && "✓"}
                </div>

                <div
                  className="cat-dot"
                  style={{ background: getCatColor(todo.category) }}
                />

                {editingId === todo.id ? (
                  <>
                    <input
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && saveEdit(todo.id)
                      }
                      autoFocus
                    />
                    <button
                      className="action-btn"
                      onClick={() => saveEdit(todo.id)}
                    >
                      ✓
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => setEditingId(null)}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`todo-text ${todo.done ? "done" : ""}`}
                    >
                      {todo.text}
                    </span>
                    <span className="todo-date">{todo.createdAt}</span>
                    <button
                      className="action-btn"
                      onClick={() => startEdit(todo)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
