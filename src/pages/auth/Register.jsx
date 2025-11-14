// Formulario de registro con manejo de estado y errores
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import Loading from "../../components/Loading";

const Register = () => {
  const { values, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, firstname, lastname } = values;

    if (!username || !email || !password || !firstname || !lastname) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
          name: firstname,
          lastname: lastname,
        }),
      });

      if (!res.ok) {
        let msg = "Error al registrarse";
        try {
          const data = await res.json();
          if (data.message) msg = data.message;
        } catch (_) {}
        throw new Error(msg);
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Registro</h2>
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

        <label className="block mb-2 text-sm text-gray-700">
          Correo electrónico
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-2 text-sm text-gray-700">
          Contraseña
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-2 text-sm text-gray-700">
          Nombre
          <input
            type="text"
            name="firstname"
            value={values.firstname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4 text-sm text-gray-700">
          Apellido
          <input
            type="text"
            name="lastname"
            value={values.lastname}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded font-medium"
          disabled={loading}
        >
          Registrarse
        </button>
      </form>

      <p className="mt-3 text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-blue-500">
          Iniciá sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default Register;
