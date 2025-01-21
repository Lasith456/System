import Navbar from "../components/NavigationBar";
// import TicketHistory from "./OldTickets";
// import TicketForm from "./TicketForm";
import { motion } from "framer-motion";
function TicketPage() {
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed flex items-center justify-center w-auto h-auto mt-20 overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl top-6 bottom-4 left-4 right-4 rounded-2xl backdrop-filter backdrop-blur-xl"
      >
        <div className="flex w-full h-full space-x-4">
          {/* Column 1 */}
          <div className="flex flex-col items-center justify-center w-1/2 p-6 rounded-xl">
            <h1>Test</h1>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center justify-center w-1/2 p-6 rounded-xl">
            <h2>Test</h2>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TicketPage;
