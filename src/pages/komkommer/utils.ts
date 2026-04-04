export type Phase = "idle" | "running" | "selecting" | "leaderboard";

export interface TimesEntry {
  naam: string;
  tijd: number;
  startjaar: number;
  eindjaar?: number;
  datum?: string;
  beschrijving?: string;
}

export interface LeaderboardEntry {
  rank: number;
  naam: string;
  tijd: number;
  startjaar: number | null;
  eindjaar?: number;
  isUser: boolean;
}

export function formatTime(ms: number): string {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

export function cucumberCount(startjaar: number, eindjaar?: number): number {
  const endYear = eindjaar ?? new Date().getFullYear();
  return Math.max(0, endYear - startjaar);
}
