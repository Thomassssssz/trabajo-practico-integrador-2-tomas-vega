import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        console.log("Error al obtener perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loading />;

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Error al cerrar sesión:", err);
    } finally {
      localStorage.removeItem("isAuth");
      window.location.href = "/login";
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-8">Perfil</h1>

      <p className="text-xl">
        <strong>Nombre:</strong> {profile?.name || "-"}
      </p>

      <p className="text-xl mt-2">
        <strong>Apellido:</strong> {profile?.lastname || "-"}
      </p>

      <button
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-lg"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;
