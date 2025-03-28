import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/ticket"
    : "/ticket";


function TicketHistory({ refreshKey }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/assign`); 
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
useEffect(() => {
    fetchTickets();
  }, [refreshKey]);

  
  // Handle ticket click to show details in popup
  const handleTicketClick = (ticket,e) => {
    e?.preventDefault();
    setSelectedTicket(ticket);
    setIsPopupVisible(true);
  };

  // Close the popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedTicket(null);
  };
  const handleRejectTicket = async (ticket,e) => {
    e?.preventDefault();
    try {
      setSelectedTicket(ticket);
      await axios.post(`${API_URL}/update_status`, {
        _id: ticket._id,
        status: "Canceled",
      });
      await fetchTickets(); 
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  const handleCompleteTicket = async (ticket,e) => {
    e?.preventDefault();
    try {
      setSelectedTicket(ticket);
      await axios.post(`${API_URL}/update_status`, {
        _id: ticket._id,
        status: "Resolved",
      });
      await fetchTickets(); 
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full h-full p-4 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl rounded-2xl backdrop-filter backdrop-blur-xl"
    >
      <div className="w-full text-gray-300">
        {/* Static Header */}
        <h2 className="mb-2 text-xl font-semibold">Assigned Ticket</h2>

        {/* Scrollable Tickets */}
        <div className="overflow-y-auto max-h-80">
          {tickets.length === 0 ? (
            <p>No tickets yet.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.ticketID}
                  className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600"
                >
                  <h3 className="text-lg font-semibold">
                    {ticket.ticketHeader}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Status: {ticket.status}
                  </p>
                  <p className="text-sm text-gray-400">ID: {ticket.ticketID}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleTicketClick(ticket,e)}
                      className="px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Show
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleRejectTicket(ticket,e)}
                      className="px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Reject
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleCompleteTicket(ticket,e)}
                      className="px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Complete
                    </motion.button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Popup for ticket details */}
      {isPopupVisible && selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-300">
              {selectedTicket.ticketHeader}
            </h2>
            <p className="mb-2 text-gray-400">
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p className="mb-2 text-gray-400">
              <strong>Ticket ID:</strong> {selectedTicket.ticketID}
            </p>
            <p className="mb-2 text-gray-400">
              <strong>Priority:</strong> {selectedTicket.prediction}
            </p>
            <p className="mb-2 text-gray-400">
              <strong>Message:</strong> {selectedTicket.text}
            </p>
            <p className="text-gray-400">
              <strong>Email:</strong> {selectedTicket.email}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default TicketHistory;
