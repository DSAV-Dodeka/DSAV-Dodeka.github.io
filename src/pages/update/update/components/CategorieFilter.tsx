interface CategorieFilterProps {
  actief: string;
  onChange: (categorie: string) => void;
}

const FILTERS = [
  { waarde: "alles", label: "Alles" },
  { waarde: "feature", label: "✨ Features" },
  { waarde: "bugfix", label: "🐛 Bugfixes" },
  { waarde: "verbetering", label: "⚡ Verbeteringen" },
  { waarde: "content", label: "📝 Content" },
] as const;

function CategorieFilter({ actief, onChange }: CategorieFilterProps) {
  return (
    <div className="categorie-filter">
      {FILTERS.map(({ waarde, label }) => (
        <button
          key={waarde}
          className={`categorie-filter__knop${actief === waarde ? " categorie-filter__knop--actief" : ""}`}
          onClick={() => onChange(waarde)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default CategorieFilter;
