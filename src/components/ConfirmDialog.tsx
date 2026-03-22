import { useEffect, useRef } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "error" | "warning" | "info";
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "error",
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) el.showModal();
    else el.close();
  }, [open]);

  // Close on backdrop click
  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  const btnVariant =
    variant === "error" ? "btn-error" : variant === "warning" ? "btn-warning" : "btn-info";

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClick}
      onCancel={onClose}
      className="modal"
    >
      <div className="modal-box ring fade bg-base-200 rounded-sleek max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 p-2 rounded-full ${variant === "error" ? "bg-error/10 text-error" : variant === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>
            <IconAlertTriangle size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">{title}</h3>
            {description && (
              <p className="text-sm text-base-content/60">{description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${btnVariant}`}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <span className="loading loading-spinner loading-xs" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
