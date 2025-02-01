import axios from "axios";
import Navbar from "../components/NavigationBar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4;
  const API_URL =
    import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_URL}ticket/allTicket`); // Adjust the endpoint as necessary
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}ticket/${id}`);
      const updatedTickets = tickets.filter((ticket) => ticket._id !== id);
      setTickets(updatedTickets);
      console.log(`Deleted ticket with ID: ${id}`);
    } catch (error) {
      console.error(`Error deleting ticket with ID: ${id}`, error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex items-center justify-center w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        <div className="w-full">
          <h1 className="mb-4 text-2xl font-semibold text-white">
            Ticket List
          </h1>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search tickets..."
            className="px-4 py-2 mb-4 mr-1.25 text-gray-900 rounded w-50% focus:outline-none"
          />

          {/* Ticket List */}
          <div className="overflow-y-auto ">
            {currentTickets.length === 0 ? (
              <p className="text-gray-300">No tickets match your search.</p>
            ) : (
              <ul className="space-y-4">
                {currentTickets.map((ticket) => (
                  <li
                    key={ticket._id}
                    className="flex items-center justify-between max-w-full p-4 mx-3 bg-gray-700 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {ticket.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 1
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-white bg-gray-700 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default TicketList;
