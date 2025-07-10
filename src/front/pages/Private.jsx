import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Private = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://effective-telegram-5g4v7qgpg4jphvp5r-3001.app.github.dev/api/private", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido o sesión expirada");
        return res.json();
      })
      .then((data) => {
        setMensaje(data.message);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        sessionStorage.removeItem("token");
        setLoading(false);
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bienvenido a la zona privada</h2>
      <p>{mensaje}</p>
      <button
        onClick={() => {
          sessionStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Private;
