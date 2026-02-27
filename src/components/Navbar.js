import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ background: "#343a40", padding: "10px" }}>
      <Link to="/dashboard" style={{ color: "white", marginRight: "15px" }}>
        Dashboard
      </Link>

      {role === "User" && (
        <Link to="/create" style={{ color: "white", marginRight: "15px" }}>
          Raise Ticket
        </Link>
      )}

      <button onClick={logout} className="btn-danger">
        Logout
      </button>
    </div>
  );
}

export default Navbar;