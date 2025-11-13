"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

type TroubleshootingModalProps = {
  open: boolean;
  onClose: () => void;
  onReport: () => void;
};

export default function TroubleshootingModal({
  open,
  onClose,
  onReport,
}: TroubleshootingModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-gray-800"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
              aria-label="Close troubleshooting modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">🧰</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-black">
                Troubleshooting Guide
              </h2>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Having technical difficulties? Try these quick fixes before contacting support:
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-3 leading-relaxed">
              <li>Ensure you have a stable internet connection.</li>
              <li>Clear your browser’s cache and cookies.</li>
              <li>Update your browser or switch to Chrome for best performance.</li>
              <li>Disable browser extensions that might block scripts or media.</li>
              <li>Try logging out and signing in again to refresh your session.</li>
            </ul>

            <button
              onClick={() => {
                onClose();
                setTimeout(onReport, 350);
              }}
              className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition"
            >
              Report an Issue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}