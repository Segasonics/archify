function Modal({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            ?
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;

