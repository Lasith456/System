import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
import Navbar from "../components/NavigationBar";

const DashBoardPage = () => {
  // const { user } = useAuthStore();

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
                <h3 className="text-lg font-bold">Completed Tickets :10</h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">Pending Tickets :9</h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">Rejected Tickets :0</h3>
              </div>

              <div className="flex items-center justify-center p-6 text-black rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-2xl">
                <h3 className="text-lg font-bold">Contact Feature</h3>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashBoardPage;
