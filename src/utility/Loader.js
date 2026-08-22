import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { IoLeafOutline } from "react-icons/io5";
import { GiHoneycomb } from "react-icons/gi";
import { TbCoffee } from "react-icons/tb";

function Loader() {
  return (
    <div className="min-h-screen bg-[#faf4ea] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <FiLoader className="w-16 h-16 text-[#E56A5C]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <motion.p
            className="text-gray-600 font-medium text-lg"
          >
            Loading...
          </motion.p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center justify-center gap-3 text-sm text-gray-400"
          >
            <GiHoneycomb className="w-4 h-4 text-[#E56A5C]" />
            <TbCoffee className="w-4 h-4 text-[#E56A5C]" />
            <IoLeafOutline className="w-4 h-4 text-[#E56A5C]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Loader;