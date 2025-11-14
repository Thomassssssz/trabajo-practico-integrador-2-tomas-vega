// Página de bienvenida con estadísticas básicas
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks-by-user", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.warn(
            "No se pudieron obtener las tareas del backend. Status:",
            res.status
          );
          setStats({ total: 0, completed: 0, pending: 0 });
          return;
        }

        const data = await res.json();

        const total = data.length;
        const completed = data.filter((t) => t.is_completed).length;
        const pending = total - completed;

        setStats({ total, completed, pending });
      } catch (err) {
        console.error("Error al obtener tareas:", err);
        setStats({ total: 0, completed: 0, pending: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Bienvenido</h1>
      <p className="mb-6 text-gray-700">
        Aquí tienes un resumen de tus tareas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Total de tareas</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Completadas</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-red-500">{stats.pending}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        *Si el servidor de tareas no responde, se muestran valores en 0.
      </p>
    </div>
  );
};

export default Home;
