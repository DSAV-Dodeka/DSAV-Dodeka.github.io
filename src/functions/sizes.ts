export function isClient() {
  return (
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

export function fontSize() {
  if (isClient()) {
    return parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
  } else {
    return 12.0;
  }
}

export function innerWidth() {
  if (isClient()) {
    return window.innerWidth;
  } else {
    return 800;
  }
}
