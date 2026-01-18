import React from "react";
import Button from "./Button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
