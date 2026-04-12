import type { Gender } from "../../../functions/sprint-calculator";

interface GenderToggleProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
}

function GenderToggle({ gender, onGenderChange }: GenderToggleProps) {
  return (
    <div
      className={`gender-toggle${gender === "vrouwen" ? " gender-toggle--vrouwen" : ""}`}
    >
      <button
        type="button"
        className={`gender-toggle__btn${gender === "mannen" ? " gender-toggle__btn--active" : ""}`}
        onClick={() => onGenderChange("mannen")}
      >
        Mannen
      </button>
      <button
        type="button"
        className={`gender-toggle__btn${gender === "vrouwen" ? " gender-toggle__btn--active" : ""}`}
        onClick={() => onGenderChange("vrouwen")}
      >
        Vrouwen
      </button>
    </div>
  );
}

export default GenderToggle;
