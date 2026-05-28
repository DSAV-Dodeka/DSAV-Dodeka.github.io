// Shared registry that lets pages contribute contextual keyboard shortcuts to
// the single global keyboard handler (KeyboardNav). A "scope" bundles the keys
// a page handles plus the help entries shown in the unified help overlay.
//
// This is a plain module-level store (with a pub/sub for the help overlay to
// re-render) so there is exactly one keyboard listener in the app, regardless
// of how many pages register contextual shortcuts.

export interface ShortcutEntry {
  keys: string;
  desc: string;
}

export interface ShortcutScope {
  id: string;
  title: string;
  entries: ShortcutEntry[];
  // Return true if the key was handled (the handler is responsible for its own
  // preventDefault). Return false to let other scopes / the browser see it.
  handleKey: (e: KeyboardEvent) => boolean;
}

const scopes = new Map<string, ShortcutScope>();
const listeners = new Set<() => void>();

// Cached, stable snapshot for useSyncExternalStore. Rebuilt only when scopes
// change, so getScopes() returns the same reference between changes (otherwise
// useSyncExternalStore loops forever thinking the store keeps changing).
let snapshot: ShortcutScope[] = [];

function emit() {
  snapshot = [...scopes.values()];
  for (const fn of listeners) fn();
}

export function registerScope(scope: ShortcutScope): () => void {
  scopes.set(scope.id, scope);
  emit();
  return () => {
    scopes.delete(scope.id);
    emit();
  };
}

export function getScopes(): ShortcutScope[] {
  return snapshot;
}

export function dispatchToScopes(e: KeyboardEvent): boolean {
  for (const scope of scopes.values()) {
    if (scope.handleKey(e)) return true;
  }
  return false;
}

export function subscribeScopes(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
