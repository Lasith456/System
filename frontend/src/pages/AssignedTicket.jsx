import Navbar from "../components/NavigationBar";
import AdminAssignedTicket from "./AdminAssignedTicket";
import AdminCompletedTicket from "./AdminCompletedTickket";
import { motion } from "framer-motion";
import { useState } from "react";

function TicketPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1); // increment triggers useEffect
  };

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
            <AdminAssignedTicket onAssign={triggerRefresh} />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center justify-center w-1/2 p-6 rounded-xl">
            <AdminCompletedTicket refreshKey={refreshKey}/>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TicketPage;
