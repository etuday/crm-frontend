import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role");
  const AGENT_ID = "699fb60987751998b5342ea4";

  const fetchTickets = async () => {
    try {
      const res = await API.get("/api/tickets");
      setTickets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ADMIN
  const assignTicket = async (id) => {
    await API.put(`/api/tickets/assign/${id}`, {
      assignedTo: AGENT_ID,
    });
    fetchTickets();
  };

  const deleteTicket = async (id) => {
    await API.delete(`/api/tickets/${id}`);
    fetchTickets();
  };

  // AGENT
  const updateStatus = async (id, status) => {
    await API.put(`/api/tickets/${id}`, { status });
    fetchTickets();
  };

  // USER
  const raiseTicket = async (e) => {
    e.preventDefault();
    if (!title) return;

    await API.post("/api/tickets", { title, description });

    setTitle("");
    setDescription("");
    setShowForm(false);
    fetchTickets();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "" || ticket.status === filterStatus)
    );
  });

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="header">
        <h2>Dashboard</h2>
        <button className="btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {/* USER BUTTON ONLY */}
      {role === "User" && (
        <>
          <button
            className="btn-primary"
            style={{ marginBottom: "20px" }}
            onClick={() => setShowForm(!showForm)}
          >
            + Raise Ticket
          </button>

          {showForm && (
            <form className="raise-form" onSubmit={raiseTicket}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button className="btn-success">Submit</button>
            </form>
          )}
        </>
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
              <td>{ticket.status}</td>
              <td>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>
              <td>
                {ticket.assignedAt
                  ? new Date(ticket.assignedAt).toLocaleDateString()
                  : "Not Assigned"}
              </td>

              {/* ADMIN */}
              {role === "Admin" && (
                <td>
                  {!ticket.assignedTo && (
                    <button
                      className="btn-primary"
                      onClick={() => assignTicket(ticket._id)}
                    >
                      Assign
                    </button>
                  )}

                  <button
                    className="btn-danger"
                    onClick={() => deleteTicket(ticket._id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              )}

              {/* AGENT */}
              {role === "Agent" && (
                <td>
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;