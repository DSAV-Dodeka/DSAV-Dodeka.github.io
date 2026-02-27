import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import { getMemberBirthdays, type Birthday } from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./verjaardagen.css";

const maanden = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];
const dagen = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
];

function formatName(entry: Birthday): string {
  const parts = [entry.voornaam];
  if (entry.tussenvoegsel) {
    parts.push(entry.tussenvoegsel);
  }
  parts.push(entry.achternaam);
  return parts.join(" ");
}

/** Parse dd/mm or dd/mm/yyyy format */
function parseDateParts(
  dateStr: string,
): { day: number; month: number; year: number | null } | null {
  const parts = dateStr.split("/");
  if (parts.length < 2) return null;
  const day = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10);
  if (isNaN(day) || isNaN(month)) return null;
  const year =
    parts.length >= 3 && parts[2] ? parseInt(parts[2], 10) : null;
  return { day, month, year: year !== null && !isNaN(year) ? year : null };
}

function getAge(parsed: { day: number; month: number; year: number | null }): number | null {
  if (parsed.year === null) return null;
  const now = new Date();
  const currentYear = now.getFullYear();
  // Build a date in the current year for this birthday
  const birthdayThisYear = new Date(currentYear, parsed.month - 1, parsed.day);
  if (birthdayThisYear < now) {
    // Birthday already passed this year
    return currentYear + 1 - parsed.year;
  }
  return currentYear - parsed.year;
}

function getDayName(parsed: { day: number; month: number }): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const d = new Date(currentYear, parsed.month - 1, parsed.day);
  if (d < now) {
    d.setFullYear(currentYear + 1);
  }
  return dagen[d.getDay()] ?? "";
}

function sortByUpcoming(birthdays: Birthday[]): Birthday[] {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  return [...birthdays].sort((a, b) => {
    const da = parseDateParts(a.geboortedatum);
    const db = parseDateParts(b.geboortedatum);
    if (!da || !db) return 0;

    const daysA = (da.month - currentMonth) * 31 + (da.day - currentDay);
    const daysB = (db.month - currentMonth) * 31 + (db.day - currentDay);
    const adjustedA = daysA < 0 ? daysA + 372 : daysA;
    const adjustedB = daysB < 0 ? daysB + 372 : daysB;
    return adjustedA - adjustedB;
  });
}

export default function Verjaardagen() {
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useSessionInfo();

  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMember = session?.user.permissions.includes("member");

  useEffect(() => {
    if (!isMember) return;
    setLoading(true);
    setError("");
    getMemberBirthdays()
      .then((result) => {
        setBirthdays(sortByUpcoming(result));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isMember]);

  if (sessionLoading) {
    return (
      <>
        <PageTitle title="Verjaardagen" />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PageTitle title="Verjaardagen" />
        <p className="verjaardagen-status">
          Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log
          in om deze pagina te kunnen bekijken.
        </p>
        <div className="verjaardagen-login">
          <button
            onClick={() => navigate("/account/login")}
            className="verjaardagen-login-button"
          >
            Inloggen
          </button>
        </div>
      </>
    );
  }

  if (!isMember) {
    return (
      <>
        <PageTitle title="Verjaardagen" />
        <p className="verjaardagen-status">
          Je hebt een actief lidmaatschap nodig om verjaardagen te bekijken.
        </p>
      </>
    );
  }

  let lastMonth = -1;

  return (
    <>
      <PageTitle title="Verjaardagen" />

      {loading ? (
        <p className="verjaardagen-status">Laden...</p>
      ) : error ? (
        <p className="verjaardagen-status">{error}</p>
      ) : birthdays.length === 0 ? (
        <p className="verjaardagen-status">Geen verjaardagen gevonden.</p>
      ) : (
        <div className="verjaardagen-container">
          {birthdays.map((entry) => {
            const parsed = parseDateParts(entry.geboortedatum);
            if (!parsed) return null;

            const showMonth = parsed.month !== lastMonth;
            lastMonth = parsed.month;

            const dayName = getDayName(parsed);
            const datumFull = `${dayName} ${parsed.day}`;
            const age = getAge(parsed);
            const name = formatName(entry);
            const key = `${name}-${entry.geboortedatum}`;

            return (
              <div key={key} className="verjaardagen-contents">
                {showMonth && (
                  <p className="verjaardagen-maand">
                    {maanden[parsed.month - 1]}
                  </p>
                )}
                <div className="verjaardag">
                  <p className="verjaardag-datum">{datumFull}</p>
                  <p className="verjaardag-datum-mobile">{parsed.day}</p>
                  <p className="verjaardag-naam">{name}</p>
                  {age !== null && (
                    <p className="verjaardag-leeftijd">{age} jaar</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
