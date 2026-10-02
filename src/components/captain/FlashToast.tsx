import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useCaptain } from "@/store/captain";

export default function FlashToast() {
  const { flash, clearFlash } = useCaptain();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {flash && (
          <motion.button
            key={flash.id}
            type="button"
            onClick={clearFlash}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-mint/50 bg-card px-4 py-3 text-left shadow-card"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint/15 text-mint-soft">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-foreground">
                {flash.title}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{flash.detail}</span>
            </span>
            <X className="h-4 w-4 shrink-0 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
