import { useState, useCallback, useRef, useEffect } from "react";

function useClipboard(): {
  copy: (text: string) => Promise<void>;
  copied: boolean;
  copiedValue: string;
} {
  const [copied, setCopied] = useState(false);
  const [copiedValue, setCopiedValue] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      setCopiedValue(text);
      setCopied(true);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copy, copied, copiedValue };
}

export { useClipboard };
export default useClipboard;
