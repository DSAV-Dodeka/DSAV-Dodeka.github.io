// Register a page's contextual keyboard shortcuts with the global keyboard
// handler. The latest handleKey closure is always used (via a ref) so the scope
// does not need to re-register on every render. Pass active=false to opt out
// (e.g. until the user is confirmed to have the required permission).

import { useEffect, useRef } from "react";
import { registerScope } from "./keyboardRegistry.ts";
import type { ShortcutEntry } from "./keyboardRegistry.ts";

interface ScopeArgs {
  id: string;
  title: string;
  entries: ShortcutEntry[];
  handleKey: (e: KeyboardEvent) => boolean;
}

export function useKeyboardScope(active: boolean, scope: ScopeArgs) {
  const handlerRef = useRef(scope.handleKey);
  handlerRef.current = scope.handleKey;

  const { id, title, entries } = scope;

  useEffect(() => {
    if (!active) return;
    return registerScope({
      id,
      title,
      entries,
      handleKey: (e) => handlerRef.current(e),
    });
  }, [active, id, title, entries]);
}
