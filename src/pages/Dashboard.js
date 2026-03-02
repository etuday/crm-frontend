import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const role = localStorage.getItem("role");

  // ================= FETCH DATA =================
  const fetchTickets = async () => {
    const res = await API.get("/api/tickets");
    setTickets(res.data);
  };

  const fetchAgents = async () => {
    if (role === "Admin") {
      const res = await API.get("/api/users/agents");
      setAgents(res.data);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  // ================= CREATE TICKET (USER) =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createTicket = async (e) => {
    e.preventDefault();
    await API.post("/api/tickets", { title, description });
    setTitle("");
    setDescription("");
    fetchTickets();
  };

  // ================= ASSIGN (ADMIN) =================
  const assignTicket = async (ticketId, agentId) => {
    await API.put(`/api/tickets/assign/${ticketId}`, {
      assignedTo: agentId,
    });
    fetchTickets();
  };

  // ================= UPDATE STATUS (AGENT) =================
  const updateStatus = async (id, status) => {
    await API.put(`/api/tickets/${id}`, { status });
    fetchTickets();
  };

  // ================= DELETE (ADMIN) =================
  const deleteTicket = async (id) => {
    await API.delete(`/api/tickets/${id}`);
    fetchTickets();
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= FILTER =================
  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "" || t.status === filterStatus)
  );

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* USER: RAISE TICKET */}
      {role === "User" && (
        <form className="ticket-form" onSubmit={createTicket}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn-primary">Raise Ticket</button>
        </form>
      )}

      {/* SEARCH */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned Date</th>
              {role !== "User" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>

                <td>
                  {role === "Agent" ? (
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        updateStatus(ticket._id, e.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  ) : (
                    ticket.status
                  )}
                </td>

                <td>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                <td>
                  {ticket.assignedAt
                    ? new Date(ticket.assignedAt).toLocaleDateString()
                    : "Not Assigned"}
                </td>

                {role === "Admin" && (
                  <td>
                    {!ticket.assignedTo && (
                      <select
                        onChange={(e) =>
                          assignTicket(ticket._id, e.target.value)
                        }
                      >
                        <option>Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      className="btn-danger"
                      onClick={() => deleteTicket(ticket._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;