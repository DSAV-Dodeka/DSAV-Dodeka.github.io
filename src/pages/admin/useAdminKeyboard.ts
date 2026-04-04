// Admin page keyboard navigation (only active outside input/textarea/select):
//   ?         — toggle keyboard shortcut help
//   [ / ]     — cycle between tabs
//   j / k     — move highlight down / up through navigable items
//   h / l     — cycle between actions within the highlighted item
//   Enter     — click the focused action in the highlighted item
//   r         — refresh the current tab's data
//   Escape    — close help if open, otherwise clear highlight

import { useEffect, useCallback } from "react";

interface Options {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  highlightedRow: number;
  setHighlightedRow: (row: number) => void;
  highlightedCol: number;
  setHighlightedCol: (col: number) => void;
  rowCount: number;
  onRefresh: () => void;
  showHelp: boolean;
  onToggleHelp: () => void;
  onCancel?: () => boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useAdminKeyboard({
  tabs,
  activeTab,
  setActiveTab,
  highlightedRow,
  setHighlightedRow,
  highlightedCol,
  setHighlightedCol,
  rowCount,
  onRefresh,
  showHelp,
  onToggleHelp,
  onCancel,
}: Options) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      switch (e.key) {
        case "?": {
          onToggleHelp();
          break;
        }

        // Tab cycling
        case "]": {
          const idx = tabs.indexOf(activeTab);
          const next = tabs[(idx + 1) % tabs.length];
          if (next !== undefined) setActiveTab(next);
          break;
        }
        case "[": {
          const idx = tabs.indexOf(activeTab);
          const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
          if (prev !== undefined) setActiveTab(prev);
          break;
        }

        // Vertical navigation
        case "j": {
          if (rowCount > 0) {
            setHighlightedRow(
              highlightedRow < 0 ? 0 : Math.min(highlightedRow + 1, rowCount - 1),
            );
            setHighlightedCol(0);
          }
          break;
        }
        case "k": {
          if (rowCount > 0) {
            setHighlightedRow(Math.max(highlightedRow - 1, 0));
            setHighlightedCol(0);
          }
          break;
        }

        // Horizontal navigation (cycle actions within highlighted item)
        case "h": {
          if (highlightedRow < 0) break;
          setHighlightedCol(Math.max(highlightedCol - 1, 0));
          break;
        }
        case "l": {
          if (highlightedRow < 0) break;
          const highlighted = document.querySelector(".admin-nav-highlight");
          if (highlighted) {
            const buttons = highlighted.querySelectorAll(".admin-button:not(:disabled)");
            setHighlightedCol(Math.min(highlightedCol + 1, buttons.length - 1));
          }
          break;
        }

        // Activate focused action
        case "Enter": {
          if (highlightedRow < 0) break;
          // If a button is already focused (via j/k or Tab), let the browser
          // handle Enter natively so it clicks whatever is actually focused
          if (document.activeElement instanceof HTMLButtonElement) return;
          // Fallback: click the admin-button in the highlighted row
          const highlighted = document.querySelector(".admin-nav-highlight");
          if (highlighted) {
            const buttons = highlighted.querySelectorAll(".admin-button:not(:disabled)");
            const btn = buttons[highlightedCol] as HTMLButtonElement | undefined;
            if (btn) btn.click();
          }
          break;
        }

        // Refresh
        case "r": {
          onRefresh();
          break;
        }

        // Close help, cancel active form, or clear highlight
        case "Escape": {
          if (showHelp) {
            onToggleHelp();
          } else if (onCancel?.()) {
            // cancel handled (e.g. close add-permission form)
          } else {
            setHighlightedRow(-1);
          }
          break;
        }

        default:
          return; // unhandled keys: exit without preventDefault
      }

      // Only reached for handled keys (they break, unhandled keys return above)
      e.preventDefault();
    },
    [tabs, activeTab, setActiveTab, highlightedRow, setHighlightedRow, highlightedCol, setHighlightedCol, rowCount, onRefresh, showHelp, onToggleHelp, onCancel],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Move real browser focus to the active button and scroll into view
  useEffect(() => {
    if (highlightedRow < 0) return;
    const highlighted = document.querySelector(".admin-nav-highlight");
    if (!highlighted) return;
    highlighted.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const buttons = highlighted.querySelectorAll(".admin-button:not(:disabled)");
    const btn = buttons[highlightedCol] as HTMLElement | undefined;
    if (btn) btn.focus();
  }, [highlightedRow, highlightedCol]);
}
