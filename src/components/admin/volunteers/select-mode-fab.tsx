"use client";

interface SelectModeFabProps {
  selectMode: boolean;
  onToggleSelectMode: () => void;
  onOpenTagModal: () => void;
  selectedCount: number;
}

export function SelectModeFab({
  selectMode,
  onToggleSelectMode,
  onOpenTagModal,
  selectedCount,
}: SelectModeFabProps) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
      {selectMode && (
        <button
          type="button"
          onClick={onOpenTagModal}
          aria-label="Manage tags for selected volunteers"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-prussian-blue)] text-white shadow-lg transition-opacity hover:opacity-80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82Z" />
            <circle
              cx="7.5"
              cy="7.5"
              r="1.5"
              fill="currentColor"
              stroke="none"
            />
          </svg>
          {selectedCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-rojo-red)] text-[10px] text-white">
              {selectedCount}
            </span>
          )}
        </button>
      )}

      {/* This button could be used in the future for other volunteer edits */}

      <button
        type="button"
        onClick={onToggleSelectMode}
        aria-pressed={selectMode}
        aria-label={selectMode ? "Exit select mode" : "Select volunteers"}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors ${
          selectMode
            ? "bg-[var(--color-prussian-blue)] text-white"
            : "border-2 border-[var(--color-prussian-blue)] bg-white text-[var(--color-prussian-blue)]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    </div>
  );
}
