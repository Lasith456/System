import { motion } from "framer-motion";

function TicketHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-full h-auto p-8 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl rounded-2xl backdrop-filter backdrop-blur-xl"
    >
      <div className="text-gray-300">
        <h2 className="mb-4 text-xl font-semibold">Message History</h2>
        <p>No messages yet.</p>
      </div>
    </motion.div>
  );
}

export default TicketHistory;
