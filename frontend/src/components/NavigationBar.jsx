import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
function Navbar() {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 shadow-xl top-4 left-4 right-4 backdrop-filter backdrop-blur-xl rounded-2xl"
    >
      <div className="text-xl font-bold text-white">UniLink</div>

      <nav className="flex space-x-6">
        <a href="/dashboard" className="text-white hover:text-gray-300">
          Home
        </a>
        <a href="/about" className="text-white hover:text-gray-300">
          About
        </a>

        <a href="/submitTicket" className="text-white hover:text-gray-300">
          Ticket
        </a>

        {(user.role === "staff" || user.role === "admin") && (
          <a href="/signTicket" className="text-white hover:text-gray-300">
            Assigned Ticket
          </a>
        )}
        {user.role === "admin" && (
          <a href="/department" className="text-white hover:text-gray-300">
            Department
          </a>
        )}
        {user.role === "admin" && (
          <a href="/adminTickets" className="text-white hover:text-gray-300">
            Tickets Edit
          </a>
        )}
        {user.role === "admin" && (
          <a href="/users" className="text-white hover:text-gray-300">
            User Managment
          </a>
        )}
      </nav>
      <div>
      {(user.role === "staff" || user.role === "admin") && (
                <h3 className="text-white">You are in {user.role} Dashboard</h3>
              )}    
      </div>
      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full px-3 py-2 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Navbar;
