// function CreateTicket() {
//   return (
//     <div>
//       <h2>Create Ticket Page</h2>
//     </div>
//   );
// }

// export default CreateTicket;


import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/tickets", {
        title,
        description,
        priority,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Raise Ticket</h2>

      <form onSubmit={handleSubmit} className="ticket-form">
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit" className="btn-primary">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default CreateTicket;