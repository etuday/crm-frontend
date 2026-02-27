function TicketCard({ ticket, onClose, onDelete, role }) {
  return (
    <div className="card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p><b>Status:</b> {ticket.status}</p>
      <p><b>Priority:</b> {ticket.priority}</p>

      {/* Agent can close */}
      {role === "Agent" && ticket.status !== "Closed" && (
        <button
          className="btn-success"
          onClick={() => onClose(ticket._id)}
        >
          Mark as Closed
        </button>
      )}

      {/* Admin can delete */}
      {role === "Admin" && (
        <button
          className="btn-danger"
          onClick={() => onDelete(ticket._id)}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default TicketCard;