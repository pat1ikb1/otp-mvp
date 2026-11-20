import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastMessage } from '@/types/lifestart';

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastMessage | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={`absolute bottom-16 right-3 left-3 z-50 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium shadow-lg backdrop-blur-md ${
            toast.tone === 'error'
              ? 'border-red-300 bg-red-600 text-white'
              : toast.tone === 'success'
                ? 'border-emerald-500/30 bg-[#0b2e26]/95 text-white'
                : 'border-emerald-700/20 bg-white/95 text-[#0b2e26]'
          }`}
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : toast.tone === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#74bf1e]" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#005e48]" />
          )}
          <span className="flex-1 leading-snug">{toast.text}</span>
          <button
            type="button"
            onClick={onClose}
            className="opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
