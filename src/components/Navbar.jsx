import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("isAuth") === "true";

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
    } finally {
      localStorage.removeItem("isAuth");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to={isAuth ? "/home" : "/login"} className="font-bold text-xl">
          Mi App
        </Link>

        <div className="flex gap-4 items-center">
          {isAuth ? (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Tareas
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Perfil
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Acceso
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : ""
                }
              >
                Registro
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
