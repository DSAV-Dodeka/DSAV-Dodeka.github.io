import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

interface ImageImport {
  variableName: string;
  importPath: string;
  originalCall: string;
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^[0-9]/, (match) => `img${match}`);
}

function extractImagePath(
  functionCall: string,
  functionName: string,
): string | null {
  const regex = new RegExp(
    `${functionName}\\s*\\(\\s*[\`'"](.*?)[\`'"]\\s*\\)`,
    "g",
  );
  const match = regex.exec(functionCall);
  return match ? match[1] : null;
}

function generateVariableName(imagePath: string): string {
  const fileName = path.basename(imagePath, path.extname(imagePath));
  return toCamelCase(fileName);
}

function findImageCalls(content: string): ImageImport[] {
  const imports: ImageImport[] = [];
  const functionNames = [
    "getImagesUrl",
    "getNestedImagesUrl",
    "getDeepImagesUrl",
  ];

  for (const functionName of functionNames) {
    const regex = new RegExp(
      `${functionName}\\s*\\(\\s*[\`'"](.*?)[\`'"]\\s*\\)`,
      "g",
    );
    let match;

    while ((match = regex.exec(content)) !== null) {
      const imagePath = match[1];
      const variableName = generateVariableName(imagePath);
      const importPath = `$images/${imagePath}`;
      const originalCall = match[0];

      // Check if we already have this import
      const existingImport = imports.find(
        (imp) => imp.importPath === importPath,
      );
      if (!existingImport) {
        imports.push({
          variableName,
          importPath,
          originalCall,
        });
      }
    }
  }

  return imports;
}

function findInsertionPoint(content: string): number {
  const lines = content.split("\n");

  // Find the line after the last import statement
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("import ") && !line.includes("//")) {
      lastImportLine = i;
    }
  }

  if (lastImportLine !== -1) {
    return lastImportLine + 1;
  }

  // If no imports found, find first 'const', 'function', 'class', 'interface', 'type', or 'export'
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("const ") ||
      line.startsWith("function ") ||
      line.startsWith("class ") ||
      line.startsWith("interface ") ||
      line.startsWith("type ") ||
      line.startsWith("export ")
    ) {
      return i;
    }
  }

  return 0;
}

function removeImportStatements(content: string): string {
  const lines = content.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    return !(
      trimmed.includes("getImagesUrl") &&
      (trimmed.includes("import") || trimmed.includes("} from"))
    );
  });
  return filteredLines.join("\n");
}

function migrateFile(filePath: string): void {
  console.log(`Processing: ${filePath}`);

  const content = fs.readFileSync(filePath, "utf-8");

  // Find all image function calls
  const imageImports = findImageCalls(content);

  if (imageImports.length === 0) {
    console.log(`  No image calls found`);
    return;
  }

  console.log(`  Found ${imageImports.length} image calls`);

  // Remove existing import statements for getImagesUrl functions
  let newContent = removeImportStatements(content);

  // Replace function calls with variable names
  for (const imageImport of imageImports) {
    const functionNames = [
      "getImagesUrl",
      "getNestedImagesUrl",
      "getDeepImagesUrl",
    ];
    for (const functionName of functionNames) {
      const regex = new RegExp(
        `${functionName}\\s*\\(\\s*[\`'"](${imageImport.importPath.replace("$images/", "")})[\`'"]\\s*\\)`,
        "g",
      );
      newContent = newContent.replace(regex, imageImport.variableName);
    }
  }

  // Add import statements
  const insertionPoint = findInsertionPoint(newContent);
  const lines = newContent.split("\n");

  const importStatements = imageImports.map(
    (imageImport) =>
      `import ${imageImport.variableName} from "${imageImport.importPath}";`,
  );

  lines.splice(insertionPoint, 0, ...importStatements);

  // Add empty line after imports if there isn't one
  if (
    insertionPoint + importStatements.length < lines.length &&
    lines[insertionPoint + importStatements.length].trim() !== ""
  ) {
    lines.splice(insertionPoint + importStatements.length, 0, "");
  }

  const finalContent = lines.join("\n");

  // Write the file
  fs.writeFileSync(filePath, finalContent, "utf-8");
  console.log(`  ✓ Migrated ${imageImports.length} image imports`);
}

async function main() {
  const srcDir = path.join(process.cwd(), "src");

  // Find all JS/JSX/TS/TSX files that might contain image imports
  const files = await glob("**/*.{js,jsx,ts,tsx}", {
    cwd: srcDir,
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  console.log(`Found ${files.length} files to process\n`);

  for (const file of files) {
    try {
      migrateFile(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log("\n✓ Migration complete!");
  console.log("\nNext steps:");
  console.log(
    "1. Remove the src/functions/links.ts file (or at least the get*ImagesUrl functions)",
  );
  console.log("2. Run your build to check for any issues");
  console.log("3. Test the application to ensure images are loading correctly");
}

main().catch(console.error);
