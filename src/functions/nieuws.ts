import NieuwsData from "../content/Nieuws.json";

export interface Nieuwsbericht {
  id: string;
  titel: string;
  datum: string;
  auteur: string;
  tekst: string;
  foto: string;
}

/**
 * Get all nieuwsberichten
 */
export function getAllNieuwsberichten(): Nieuwsbericht[] {
  return NieuwsData.nieuwsberichten;
}

/**
 * Find a nieuwsbericht by its ID
 */
export function findNieuwsberichtById(id: string): Nieuwsbericht | undefined {
  return NieuwsData.nieuwsberichten.find((bericht) => bericht.id === id);
}

/**
 * Get all nieuwsbericht IDs
 */
export function getNieuwsberichtIds(): string[] {
  return NieuwsData.nieuwsberichten.map((bericht) => bericht.id);
}
