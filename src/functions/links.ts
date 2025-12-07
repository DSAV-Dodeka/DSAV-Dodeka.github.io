const imageModules = import.meta.glob<string>(
  "/src/images/**/*.{png,jpg,jpeg,webp,gif,svg}",
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

export const getImagesUrl = (loc: string) => {
  return new URL(`../images/${loc}`, import.meta.url).href;
};

// TODO this is ugly hack to fix new behavior (which "fixes" a bug) from Vite 6
export const getNestedImagesUrl = (loc: string) => {
  const split = loc.split("/");
  return new URL(`../images/${split[0]}/${split[1]}`, import.meta.url).href;
};
