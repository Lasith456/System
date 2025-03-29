import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
// import { useAuthStore } from "../store/authStore";
import Navbar from "../components/NavigationBar";
const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/";

const DashBoardPage = () => {
  // const { user } = useAuthStore();
  const [ticketCounts, setTicketCounts] = useState({
    completed: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchTicketCounts = async () => {
      try {
        const response = await axios.get(`${API_URL}ticket/counts`);
        setTicketCounts({
          completed: response.data.completed || 0,
          pending: response.data.pending || 0,
          rejected: response.data.rejected || 0,
        });
      } catch (error) {
        console.error("Error fetching ticket counts:", error);
      }
    };

    fetchTicketCounts();
  }, []);
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex items-center justify-center w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        {" "}
        <div>
          <h2 className="mb-6 text-4xl font-bold text-center text-white">
            Welcome to the <span className="text-green-400">SmartUNI</span>
          </h2>{" "}
        </div>
        <div className="p-8">
          <div className="my-2">
            <div className="grid w-auto h-auto grid-cols-2 gap-6 p-6">
              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">
                  Completed Tickets: {ticketCounts.completed}
                </h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">
                  Pending Tickets: {ticketCounts.pending}
                </h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">
                  Rejected Tickets: {ticketCounts.rejected}
                </h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
              <h3 className="text-lg font-bold">
                  All Tickets: {ticketCounts.rejected+ticketCounts.completed+ticketCounts.pending}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashBoardPage;
