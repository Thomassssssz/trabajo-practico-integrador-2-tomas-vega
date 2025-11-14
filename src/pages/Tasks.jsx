import React, { useEffect, useState } from "react";
import useForm from "../hooks/useForm";
import Loading from "../components/Loading";

const Tasks = () => {
  const { values, handleChange, resetForm, setValues } = useForm({
    title: "",
    description: "",
    is_completed: false,
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const getTaskId = (task) => task.id || task._id;

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/tasks-by-user", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("No se pudieron obtener las tareas. Status:", res.status);
        setTasks([]);
        return;
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!values.title || !values.description) {
      setError("Título y descripción son obligatorios");
      return;
    }

    setSaving(true);

    if (editingTask) {
      const updatedList = tasks.map((t) =>
        getTaskId(t) === getTaskId(editingTask) ? { ...t, ...values } : t
      );
      setTasks(updatedList);
    } else {
      const fakeId = Date.now();
      const newTask = {
        id: fakeId,
        title: values.title,
        description: values.description,
        is_completed: values.is_completed,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    try {
      if (editingTask) {
        const id = getTaskId(editingTask);
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          console.warn("Error al actualizar tarea. Status:", res.status);
          setError("No se pudo actualizar la tarea en el servidor");
        } else {
          setSuccess("Tarea actualizada correctamente");
        }
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          console.warn("Error al crear tarea. Status:", res.status);
          setError("No se pudo crear la tarea en el servidor");
        } else {
          setSuccess("Tarea creada correctamente");
        }
      }

      setEditingTask(null);
      resetForm();
      loadTasks();
    } catch (err) {
      console.error("Error al guardar tarea:", err);
      setError("Ocurrió un error al guardar la tarea");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setValues({
      title: task.title || "",
      description: task.description || "",
      is_completed: !!task.is_completed,
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (task) => {
    const id = getTaskId(task);
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta tarea?"
    );
    if (!confirmDelete) return;

    setTasks((prev) => prev.filter((t) => getTaskId(t) !== id));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("Error al eliminar tarea. Status:", res.status);
        setError("No se pudo eliminar la tarea en el servidor");
      } else {
        setSuccess("Tarea eliminada correctamente");
      }
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      setError("Ocurrió un error al eliminar la tarea");
    }
  };

  const handleToggleComplete = async (task) => {
    const id = getTaskId(task);
    const updated = { ...task, is_completed: !task.is_completed };

    setTasks((prev) => prev.map((t) => (getTaskId(t) === id ? updated : t)));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: updated.title,
          description: updated.description,
          is_completed: updated.is_completed,
        }),
      });

      if (!res.ok) {
        console.warn("Error al cambiar estado de tarea. Status:", res.status);
        setError("No se pudo actualizar el estado en el servidor");
      } else {
        setSuccess("Estado de la tarea actualizado");
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError("Ocurrió un error al cambiar el estado de la tarea");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Tareas</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white shadow rounded p-4"
      >
        <h3 className="text-lg font-semibold mb-3">
          {editingTask ? "Editar tarea" : "Nueva tarea"}
        </h3>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">
            Título
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">
            Descripción
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
          </label>
        </div>

        <label className="inline-flex items-center mb-4 text-sm text-gray-700">
          <input
            type="checkbox"
            name="is_completed"
            checked={values.is_completed}
            onChange={handleChange}
            className="mr-2"
          />
          Marcar como completada
        </label>

        <div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2 disabled:opacity-60"
            disabled={saving}
          >
            {editingTask ? "Guardar cambios" : "Crear tarea"}
          </button>

          {editingTask && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded"
              onClick={() => {
                setEditingTask(null);
                resetForm();
                setError("");
                setSuccess("");
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      {tasks.length === 0 ? (
        <p className="text-gray-600">No hay tareas registradas.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const id = getTaskId(task);
            return (
              <li
                key={id}
                className={`bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between ${
                  task.is_completed ? "opacity-75" : ""
                }`}
              >
                <div>
                  <h4
                    className={`font-semibold ${
                      task.is_completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-700">{task.description}</p>
                  <p className="text-xs mt-1">
                    Estado:{" "}
                    <span
                      className={
                        task.is_completed ? "text-green-600" : "text-red-500"
                      }
                    >
                      {task.is_completed ? "Completada" : "Pendiente"}
                    </span>
                  </p>
                </div>

                <div className="mt-3 md:mt-0 flex gap-2">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {task.is_completed
                      ? "Marcar como pendiente"
                      : "Marcar como completada"}
                  </button>
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
