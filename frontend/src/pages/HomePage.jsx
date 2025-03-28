import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-6 text-white bg-gray-900 bg-opacity-80 backdrop-blur-lg">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center text-emerald-400 sm:text-5xl"
      >
        Welcome to SMARTUNI 🎓
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-lg text-center text-gray-300 sm:text-xl"
      >
        A Smart ML-Based Ticket Handling System for University Services
      </motion.p>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3"
      >
        {[
          "AI-Powered Ticket Prioritization",
          "Smart Assignment to Departments",
          "Real-Time Status Tracking",
          "Secure and Role-Based Access",
          "Instant Chat Support with AI",
          "Designed for University Needs",
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="p-4 text-center transition-shadow duration-300 bg-gray-800 border border-emerald-500 rounded-xl shadow hover:shadow-lg"
          >
            <p className="font-semibold text-emerald-300">{feature}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNavigate}
        className="px-6 py-4 mt-12 text-lg font-bold text-white transition duration-300 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Let&apos;s Get Started 🚀
      </motion.button>
    </div>
  );
};

export default HomePage;
