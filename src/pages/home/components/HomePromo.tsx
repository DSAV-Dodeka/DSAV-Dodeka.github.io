import { Link } from "react-router";
import "./HomePromo.scss";

function HomePromo() {
  return (
    <Link to={"/owee"} className="home_promo_link">
      <div className="home_promo">
        <span className="home_promo_date">16&ndash;20 aug</span>
        <div className="home_promo_text">
          <p className="home_promo_title">Wij zijn op de OWee!</p>
          <p className="home_promo_sub">Bekijk al onze activiteiten</p>
        </div>
        <span className="home_promo_cta" aria-hidden="true">
          <svg
            className="home_promo_arrow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default HomePromo;
