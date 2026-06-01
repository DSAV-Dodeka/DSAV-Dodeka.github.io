// Admin dashboard contextual keyboard shortcuts. These register with the global
// keyboard handler (KeyboardNav) via useKeyboardScope, so there is a single
// keydown listener app-wide and the help overlay ("?") is shared. The help
// toggle, leader commands, and "?" live in KeyboardNav; this only contributes
// the admin table navigation while the admin dashboard is mounted.
//
//   [ / ]     — cycle between tabs
//   j / k     — move highlight down / up through navigable items
//   h / l     — cycle between actions within the highlighted item
//   Enter     — click the focused action in the highlighted item
//   r         — refresh the current tab's data
//   Escape    — cancel an active form, otherwise clear the highlight

import { useEffect } from "react";
import { useKeyboardScope } from "$components/useKeyboardScope.ts";
import type { ShortcutEntry } from "$components/keyboardRegistry.ts";

const ADMIN_HELP_ENTRIES: ShortcutEntry[] = [
  { keys: "[ / ]", desc: "Previous / next tab" },
  { keys: "j / k", desc: "Move highlight down / up" },
  { keys: "h / l", desc: "Cycle actions within highlighted item" },
  { keys: "Enter", desc: "Click focused action" },
  { keys: "r", desc: "Refresh current tab" },
  { keys: "Escape", desc: "Cancel form / clear highlight" },
];

interface Options {
  active: boolean;
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  highlightedRow: number;
  setHighlightedRow: (row: number) => void;
  highlightedCol: number;
  setHighlightedCol: (col: number) => void;
  rowCount: number;
  onRefresh: () => void;
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
  active,
  tabs,
  activeTab,
  setActiveTab,
  highlightedRow,
  setHighlightedRow,
  highlightedCol,
  setHighlightedCol,
  rowCount,
  onRefresh,
  onCancel,
}: Options) {
  const handleKey = (e: KeyboardEvent): boolean => {
    if (isEditable(e.target)) return false;
    if (e.ctrlKey || e.altKey || e.metaKey) return false;

    switch (e.key) {
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
        if (highlightedRow < 0) return false;
        // If a button is already focused (via j/k or Tab), let the browser
        // handle Enter natively so it clicks whatever is actually focused
        if (document.activeElement instanceof HTMLButtonElement) return false;
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

      // Cancel active form, or clear highlight
      case "Escape": {
        if (onCancel?.()) {
          // cancel handled (e.g. close add-permission form)
        } else if (highlightedRow >= 0) {
          setHighlightedRow(-1);
        } else {
          return false; // nothing to cancel: let the key pass through
        }
        break;
      }

      default:
        return false; // unhandled keys: not ours
    }

    e.preventDefault();
    return true;
  };

  useKeyboardScope(active, {
    id: "admin",
    title: "Admin Navigation",
    entries: ADMIN_HELP_ENTRIES,
    handleKey,
  });

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
