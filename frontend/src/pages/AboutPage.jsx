import { motion } from "framer-motion";
import Navbar from "../components/NavigationBar";

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center w-full h-full max-w-4xl p-8 mx-auto mt-12 bg-gray-800 shadow-2xl bg-opacity-80 rounded-2xl backdrop-filter backdrop-blur-lg"
      >
        <h2 className="mb-6 text-4xl font-bold text-center text-green-400">
          About <span className="text-white">UniLink</span>
        </h2>
        <p className="text-lg leading-relaxed text-center text-gray-300">
        UniLink is a comprehensive ticket management system designed to
          streamline issue handling and improve communication across the
          university. Our platform empowers students, faculty, and staff to
          efficiently raise tickets, track their progress, and ensure quick
          resolutions for any queries or issues.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;
