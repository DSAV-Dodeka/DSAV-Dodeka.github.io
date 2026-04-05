import { useEffect } from "react";

export default function MemoRedirect() {
  useEffect(() => {
    window.location.href = "/memo/index.html";
  }, []);

  return null;
}
