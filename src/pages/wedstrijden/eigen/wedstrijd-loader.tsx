import { useParams } from "@tanstack/react-router";
import Wedstrijd from "./wedstrijd";
import { findWedstrijdByPath } from "$functions/wedstrijden.ts";

export default function WedstrijdLoader() {
  const { wedstrijdPath } = useParams({
    from: "/wedstrijden/$wedstrijdPath",
  });

  const wedstrijd = findWedstrijdByPath(`/${wedstrijdPath}`);

  if (!wedstrijd) {
    return <div>Wedstrijd niet gevonden</div>;
  }

  return <Wedstrijd wedstrijd={wedstrijd} />;
}
