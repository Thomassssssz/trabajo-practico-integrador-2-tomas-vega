// Página de login con manejo de estados y errores

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import Loading from "../../components/Loading";

const Login = () => {
  const { values, handleChange } = useForm({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.username || !values.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!res.ok) {
        let msg = "Credenciales inválidas";
        try {
          const data = await res.json();
          if (data.message) msg = data.message;
        } catch (_) {}
        throw new Error(msg);
      }

      localStorage.setItem("isAuth", "true");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm text-gray-700">
          Usuario
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4 text-sm text-gray-700">
          Contraseña
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-medium"
          disabled={loading}
        >
          Acceso
        </button>
      </form>

      <p className="mt-3 text-sm">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-blue-500">
          Registrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
