// Restringe rutas públicas si el usuario ya está logueado

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  );

  useEffect(() => {
    if (isAuth) {
      setChecking(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuth(true);
          localStorage.setItem("isAuth", "true");
        } else {
          setIsAuth(false);
          localStorage.removeItem("isAuth");
        }
      } catch (err) {
        setIsAuth(false);
        localStorage.removeItem("isAuth");
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();
  }, [isAuth]);

  if (checking) return <Loading />;

  return isAuth ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
