import { useState } from "react";
import Input from "../components/Input";
import { Mail, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTicketStore } from "../store/ticketStore";
import { motion } from "framer-motion";

const TicketForm = () => {
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState("");
  const [ticketHeader, setTicketHeader] = useState("");

  const { predict, isLoading, error, priority } = useTicketStore();
  const submitTicket = async (e) => {
    e.preventDefault();
    await predict(ticket, user.email, ticketHeader);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-full h-auto p-8 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl rounded-2xl backdrop-filter backdrop-blur-xl"
    >
      <div className="w-full">
        <form onSubmit={submitTicket}>
          <Input
            icon={Mail}
            type="text"
            placeholder="Enter Your Ticket Subject"
            onChange={(e) => setTicketHeader(e.target.value)}
          />
          <Input
            icon={Mail}
            type="text"
            placeholder="Enter Your Ticket Description"
            onChange={(e) => setTicket(e.target.value)}
          />
          {error && <p className="mb-2 font-semibold text-red-500">{error}</p>}
          {priority && (
            <p className="mb-2 font-semibold text-green-400">
              Predicted Priority is: {priority}
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 mx-auto animate-spin" />
            ) : (
              "Predict"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default TicketForm;
