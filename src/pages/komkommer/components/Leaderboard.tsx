import { formatTime, cucumberCount } from "../utils";
import type { LeaderboardEntry, TimesEntry } from "../utils";
import timesDataFile from "$content/KomkommerTijden.json";

interface LeaderboardProps {
  userTime: number;
  userName: string;
}

export function buildLeaderboard(
  data: TimesEntry[],
  userTime: number,
  userName: string,
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = data.map((entry) => ({
    rank: 0,
    naam: entry.naam,
    tijd: entry.tijd,
    startjaar: entry.startjaar,
    ...(entry.eindjaar !== undefined ? { eindjaar: entry.eindjaar } : {}),
    isUser: false,
  }));

  entries.push({
    rank: 0,
    naam: userName,
    tijd: userTime,
    startjaar: null,
    isUser: true,
  });

  entries.sort((a, b) => a.tijd - b.tijd);

  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

const timesData = timesDataFile.tijden;

export function Leaderboard({ userTime, userName }: LeaderboardProps) {
  const entries = buildLeaderboard(
    timesData as TimesEntry[],
    userTime,
    userName,
  );

  return (
    <div className="leaderboard">
      <h2 className="leaderboard__heading">Ranglijst</h2>
      <ol className="leaderboard__list">
        {entries.map((entry) => (
          <li
            key={`${entry.naam}-${entry.tijd}`}
            className={`leaderboard__entry${entry.isUser ? " leaderboard__entry--user" : ""}`}
          >
            <span className="leaderboard__rank">{entry.rank}.</span>
            <div className="leaderboard__info">
              <span className="leaderboard__name">{entry.naam}</span>
              {!entry.isUser && entry.startjaar !== null && (
                <span className="leaderboard__cucumbers">
                  {"🥒".repeat(cucumberCount(entry.startjaar, entry.eindjaar))}
                </span>
              )}
            </div>
            <span className="leaderboard__time">{formatTime(entry.tijd)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
