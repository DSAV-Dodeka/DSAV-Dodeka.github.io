import { redirect } from "react-router";

export function loader() {
  return redirect("/trainingen/sprint_tijden");
}

export default function SprintTijdenAlias() {
  return null;
}
