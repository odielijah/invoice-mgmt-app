import { useEffect } from "react";

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  // Trap focus + ESC handled in parent

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="bg-white dark:bg-[#1E2139] rounded-[8px] p-7 md:p-12 max-w-[480px] w-full shadow-2xl md:mx-0">
        <h2 id="delete-title" className="dark:text-white mb-3">Confirm Deletion</h2>
        <p className="text-text-muted dark:text-light-gray mb-8">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="cursor-pointer bg-[#F9FAFE] dark:bg-[#252945] text-secondary dark:text-light-gray px-6 py-3 rounded-full font-bold hover:bg-light-gray transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer bg-danger text-white px-6 py-3 rounded-full font-bold hover:bg-danger-light transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}