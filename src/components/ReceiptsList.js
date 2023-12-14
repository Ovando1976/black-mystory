// This is ReceiptsList.js that will display a list of receipts
import React, { useContext } from "react"; // Import useContext here
import { useSocket } from "../components/SocketContext";
import { AuthContext } from '../context/AuthContext';

export const ReceiptsList = ({ receipts }) => {
  const { socket } = useSocket();
  const { user, dispatch } = useContext(AuthContext);

  const approveReceipt = (id) => {
    socket.emit("approveReceipt", id);
  };

  const deleteReceipt = (id) => {
    socket.emit("deleteReceipt", id);
  };

  return (
    <div>
      {receipts.map((receipt) => (
        <div key={receipt.id}>
          <h2>{receipt.name}</h2>
          <img src={receipt.image} alt={`${receipt.name}'s receipt`} />
          <p>Amount: {receipt.amount}</p>
          <p>Category: {receipt.category}</p>
          <p>Date: {receipt.date}</p>
          <button onClick={() => approveReceipt(receipt.id)}>Approve Receipt</button>
          <button onClick={() => deleteReceipt(receipt.id)}>Delete Receipt</button>
        </div>
      ))}
    </div>
  );
};
