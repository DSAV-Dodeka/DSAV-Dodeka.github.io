import { useEffect, useRef, useState } from "react";
import avr1 from "../game/Aardvark-run1.png";
import avj from "../game/Aardvark-jump.png";
import "./Mierenvangen.scss";

// Internal render resolution is intentionally tiny; the canvas is scaled
// up with `image-rendering: pixelated` so every sprite reads as chunky pixel art.
const WIDTH = 320;
const HEIGHT = 160;
const GROUND = 24;
const CELL = 4; // pixel-art grid cell size, in internal px

// Hand-authored pixel sprites, '.' = transparent
const ANT_SPRITE = [
  "........",
  "...##...",
  "..####..",
  "...##...",
  "..#..#..",
  ".#....#.",
  "...##...",
  "........",
];

const ROCK_SPRITE = [
  "........",
  "..####..",
  ".######.",
  "########",
  "########",
  ".######.",
  "..####..",
  "........",
];

type FallingItem = {
  x: number;
  y: number;
  type: "ant" | "rock";
};

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  color: string,
) {
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row]!;
    for (let col = 0; col < line.length; col++) {
      if (line[col] !== "#") continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col * CELL, y + row * CELL, CELL, CELL);
    }
  }
}

export default function Mierenvangen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const characterXRef = useRef(WIDTH / 2);
  const itemsRef = useRef<FallingItem[]>([]);
  const scoreRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const charWidth = 28;
    const charHeight = 28;

    let animationFrameId: number;
    let frameCounter = 0;
    let fallSpeed = 0.6;
    let spawnChance = 0.02;

    const charImages = [avr1, avj].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const resetGame = () => {
      characterXRef.current = WIDTH / 2;
      itemsRef.current = [];
      scoreRef.current = 0;
      frameCounter = 0;
      fallSpeed = 0.6;
      spawnChance = 0.02;
    };

    const drawOverlay = (lines: string[]) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      lines.forEach((line, i) => {
        ctx.font = i === 0 ? "12px monospace" : "8px monospace";
        ctx.fillText(line, WIDTH / 2, HEIGHT / 2 - 10 + i * 16);
      });
    };

    const update = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "#cdeac0";
      ctx.fillRect(0, 0, WIDTH, HEIGHT - GROUND);
      ctx.fillStyle = "#9c6b3e";
      ctx.fillRect(0, HEIGHT - GROUND, WIDTH, GROUND);

      if (!isGameStarted) {
        drawOverlay(["VANG DE MIEREN", "Pijltjestoetsen + spatie"]);
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      if (isGameOver) {
        drawOverlay(["GAME OVER", `Score: ${scoreRef.current}`, "Spatie om opnieuw te beginnen"]);
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      if (keysRef.current.left) characterXRef.current -= 3;
      if (keysRef.current.right) characterXRef.current += 3;
      characterXRef.current = Math.max(
        0,
        Math.min(WIDTH - charWidth, characterXRef.current),
      );

      frameCounter++;
      const charImage = charImages[Math.floor(frameCounter / 10) % charImages.length]!;
      ctx.drawImage(
        charImage,
        characterXRef.current,
        HEIGHT - GROUND - charHeight,
        charWidth,
        charHeight,
      );

      let items = itemsRef.current.map((item) => ({
        ...item,
        y: item.y + fallSpeed,
      }));

      const survivors: FallingItem[] = [];
      for (const item of items) {
        const caught =
          item.y + CELL * 8 >= HEIGHT - GROUND - charHeight / 2 &&
          item.y < HEIGHT - GROUND &&
          item.x + CELL * 8 > characterXRef.current &&
          item.x < characterXRef.current + charWidth;

        if (caught) {
          if (item.type === "ant") {
            scoreRef.current += 1;
          } else {
            setIsGameOver(true);
          }
          continue;
        }

        if (item.y < HEIGHT) {
          survivors.push(item);
        }
      }
      items = survivors;

      if (Math.random() < spawnChance) {
        items.push({
          x: Math.random() * (WIDTH - CELL * 8),
          y: -CELL * 8,
          type: Math.random() < 0.8 ? "ant" : "rock",
        });
      }
      itemsRef.current = items;

      for (const item of items) {
        drawSprite(
          ctx,
          item.type === "ant" ? ANT_SPRITE : ROCK_SPRITE,
          item.x,
          item.y,
          item.type === "ant" ? "#2b1b12" : "#6b6b6b",
        );
      }

      if (frameCounter % 300 === 0) {
        fallSpeed += 0.15;
        spawnChance += 0.005;
      }

      ctx.fillStyle = "#001f48";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${scoreRef.current}`, 6, 12);

      animationFrameId = requestAnimationFrame(update);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keysRef.current.left = true;
      if (e.code === "ArrowRight") keysRef.current.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        if (!isGameStarted) {
          setIsGameStarted(true);
        } else if (isGameOver) {
          resetGame();
          setIsGameOver(false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keysRef.current.left = false;
      if (e.code === "ArrowRight") keysRef.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isGameStarted, isGameOver]);

  return (
    <div className="mierenvangen-container">
      <h2 className="mierenvangen-title">ARNOLD VANGT MIEREN</h2>
      <canvas
        className="mierenvangen-canvas"
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
      <p className="mierenvangen-hint">
        ← → bewegen · spatie om te (her)starten
      </p>
    </div>
  );
}
