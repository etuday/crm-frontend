// function CreateTicket() {
//   return (
//     <div>
//       <h2>Create Ticket Page</h2>
//     </div>
//   );
// }

// export default CreateTicket;


import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/api/tickets", {
      title,
      description,
      priority: "Medium",
    });

    alert("Ticket Created");
    window.location.href = "/dashboard";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Raise Ticket</h2>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br /><br />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br /><br />
          <button className="btn-primary">Submit</button>
        </form>
      </div>
    </>
  );
}

export default CreateTicket;