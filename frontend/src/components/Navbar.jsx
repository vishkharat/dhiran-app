import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      style={{
        padding: "15px",
        background: "#111",
        color: "#fff",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link style={{ color: "#fff" }} to="/">Dashboard</Link>
      <Link style={{ color: "#fff" }} to="/customers">Customers</Link>
    </div>
  );
};

export default Navbar;