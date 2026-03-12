import { NavLink } from "react-router-dom";

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#4da6ff" : "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500"
  });

  return (

    <div
      style={{
        padding: "15px 25px",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
      }}
    >

      {/* LEFT SIDE MENU */}
      <div style={{ display: "flex", gap: "25px" }}>

        <NavLink to="/" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/customers" style={linkStyle}>
          Customers
        </NavLink>

      </div>

      {/* RIGHT SIDE LOGOUT */}
      <button
        onClick={handleLogout}
        style={{
          padding: "7px 14px",
          background: "#e74c3c",
          border: "none",
          borderRadius: "5px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

    </div>

  );

};

export default Navbar;