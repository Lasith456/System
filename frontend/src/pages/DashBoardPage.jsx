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
        <div className="p-8">
          <div className="my-2">
            <h3 className="text-white">Welcome to The SMARTUNI System..</h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashBoardPage;
