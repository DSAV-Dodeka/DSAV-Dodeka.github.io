import type { ReactNode } from "react";

interface TijdlijnGroepProps {
  label: string;
  children: ReactNode;
}

function TijdlijnGroep({ label, children }: TijdlijnGroepProps) {
  return (
    <section className="tijdlijn-groep">
      <h2 className="tijdlijn-groep__label">{label}</h2>
      <div className="tijdlijn-groep__items">{children}</div>
    </section>
  );
}

export default TijdlijnGroep;
