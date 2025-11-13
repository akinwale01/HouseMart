"use client";

import React from "react";

interface ModalProps {
  onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-700 mb-6">
          You need to login to access this feature. Click the login button below to continue.
        </p>
        <div className="flex flex-row gap-3 items-center justify-center">
        <a
          href="/login"
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition inline-block mb-4"
        >
          Login
        </a>

        <button
          onClick={onClose}
          className="text-gray-500 underline hover:text-gray-700"
        >
          Cancel
        </button>
        </div>
      </div>
    </div>
  );
}