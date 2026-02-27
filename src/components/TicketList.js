import { useEffect, useState } from "react";
import API from "../services/api";

function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    API.get("/api/tickets")
      .then((res) => setTickets(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h3>Tickets</h3>
      {tickets.map((ticket) => (
        <div key={ticket._id} style={{border:"1px solid gray", margin:"10px", padding:"10px"}}>
          <p><b>{ticket.title}</b></p>
          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
        </div>
      ))}
    </div>
  );
}

export default TicketList;