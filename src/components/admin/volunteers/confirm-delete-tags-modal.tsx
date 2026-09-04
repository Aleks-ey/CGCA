"use client";

import { Modal } from "@/components/ui/modal";

interface ConfirmDeleteTagsModalProps {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteTagsModal({
  open,
  count,
  onCancel,
  onConfirm,
}: ConfirmDeleteTagsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete tags?"
      zIndexClassName="z-[60]"
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete {count} tag{count === 1 ? "" : "s"}?
        This will remove {count === 1 ? "it" : "them"} from every volunteer{" "}
        {count === 1 ? "it's" : "they're"} applied to. This can&apos;t be
        undone.
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-[var(--color-rojo-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-80"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
