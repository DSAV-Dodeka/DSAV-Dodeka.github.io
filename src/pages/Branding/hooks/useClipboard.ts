import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom hook for copying text to the clipboard.
 *
 * Uses `navigator.clipboard.writeText()` as the primary method,
 * falling back to a temporary textarea + `document.execCommand('copy')`
 * when the Clipboard API is unavailable.
 *
 * Returns a `copied` boolean that becomes `true` after a successful copy
 * and resets to `false` after 2 seconds.
 */
function useClipboard(): {
  copy: (text: string) => Promise<void>;
  copied: boolean;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string): Promise<void> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: create a temporary textarea
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // Clear any existing timeout before setting a new one
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      setCopied(true);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch {
      // If both methods fail, reset copied state
      setCopied(false);
    }
  }, []);

  return { copy, copied };
}

export { useClipboard };
export default useClipboard;
