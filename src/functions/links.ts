const imageModules = import.meta.glob<string>(
  "/src/images/**/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP,GIF,SVG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

export function getHashedImageUrl(relativePath: string): string {
  // Normalize the path to match glob keys
  const normalizedPath = relativePath.startsWith("/")
    ? `/src/images${relativePath}`
    : `/src/images/${relativePath}`;

  const hashedUrl = imageModules[normalizedPath];

  if (!hashedUrl) {
    console.warn(`Image not found: ${relativePath}`);
    // Optionally fall back or throw
    return relativePath;
  }

  return hashedUrl;
}
