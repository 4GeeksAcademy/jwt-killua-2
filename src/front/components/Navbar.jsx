import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{
      padding: "1rem",
      backgroundColor: "#282c34",
      color: "white",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "1rem" }}>
          Inicio
        </Link>
        {isAuthenticated && (
          <Link to="/private" style={{ color: "white", textDecoration: "none" }}>
            Privado
          </Link>
        )}
      </div>

      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "white", border: "none", cursor: "pointer" }}>
            Cerrar sesión
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "1rem" }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
