import { useEffect, useState } from "react";
import API from "../services/api";
import TicketCard from "../components/TicketCard";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [tickets, setTickets] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;

  const fetchTickets = async () => {
    const res = await API.get("/api/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const deleteTicket = async (id) => {
    await API.delete(`/api/tickets/${id}`);
    fetchTickets();
  };

  const closeTicket = async (id) => {
    await API.put(`/api/tickets/${id}`, { status: "Closed" });
    fetchTickets();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Dashboard</h2>

        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onDelete={deleteTicket}
            onClose={closeTicket}
            role={role}
          />
        ))}
      </div>
    </>
  );
}

export default Dashboard;