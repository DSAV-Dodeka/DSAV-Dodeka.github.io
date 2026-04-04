import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import Modal from "../../components/Modal/Modal";
import Introduction from "./components/Introduction";
import ColorPalette from "./components/ColorPalette";
import Typography from "./components/Typography";
import LogoSection, { LogoVariant } from "./components/LogoSection";
import FormatPicker from "./components/FormatPicker";
import CrapRules from "./components/CrapRules";
import DesignTips from "./components/DesignTips";
import BrandHistory from "./components/BrandHistory";
import "./Branding.scss";

function Branding() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{
    logo: LogoVariant;
    colorVariant: "dark" | "white";
  } | null>(null);

  const handleLogoClick = (
    logo: LogoVariant,
    colorVariant: "dark" | "white"
  ) => {
    setSelectedLogo({ logo, colorVariant });
    setShowModal(true);
  };

  return (
    <div className="branding-page">
      {/* Animated background shapes */}
      <div className="branding-bg" aria-hidden="true">
        <div className="branding-bg__shape branding-bg__shape--1" />
        <div className="branding-bg__shape branding-bg__shape--2" />
        <div className="branding-bg__shape branding-bg__shape--3" />
        <div className="branding-bg__shape branding-bg__shape--4" />
        <div className="branding-bg__shape branding-bg__shape--5" />
        <div className="branding-bg__shape branding-bg__shape--6" />
        <div className="branding-bg__shape branding-bg__shape--7" />
        <div className="branding-bg__shape branding-bg__shape--8" />
        <div className="branding-bg__shape branding-bg__shape--9" />
        <div className="branding-bg__shape branding-bg__shape--10" />
        <div className="branding-bg__shape branding-bg__shape--11" />
        <div className="branding-bg__shape branding-bg__shape--12" />
        <div className="branding-bg__shape branding-bg__shape--13" />
      </div>

      <PageTitle title="huisstijl" />
      {/* Introduction */}
      <section className="branding-section">
        <h2>Huisstijl Introductie</h2>
        <Introduction />
      </section>
      {/* ColorPalette */}
      <section className="branding-section">
        <h2>Kleurenpalette</h2>
        <ColorPalette />
      </section>
      {/* Typography */}
      <section className="branding-section">
        <h2>Lettertypes</h2>
        <Typography />
      </section>
      {/* LogoSection */}
      <section className="branding-section">
        <h2>Logo's</h2>
        <LogoSection onLogoClick={handleLogoClick} />
      </section>
      {/* CrapRules */}
      <section className="branding-section">
        <h2>CRAP-regels en toepassing</h2>
        <CrapRules />
      </section>
      {/* DesignTips */}
      <section className="branding-section">
        <h2>Praktische ontwerptips</h2>
        <DesignTips />
      </section>
      {/* BrandHistory */}
      <section className="branding-section">
        <h2>Herkomst van het logo</h2>
        <BrandHistory />
      </section>

      <Modal
        Title={
          <span>
            {selectedLogo?.logo.name ?? ""}{" "}
            <span style={{ opacity: 0.6, fontWeight: 400, fontSize: "0.75em" }}>
              ({selectedLogo?.colorVariant === "dark" ? "Donkerblauw" : "Wit"})
            </span>
          </span>
        }
        Content={
          selectedLogo ? (
            <FormatPicker
              logoName={selectedLogo.logo.name}
              logoId={selectedLogo.logo.id}
              colorVariant={selectedLogo.colorVariant}
              previewSrc={selectedLogo.colorVariant === "dark" ? selectedLogo.logo.previewDark : selectedLogo.logo.previewWhite}
            />
          ) : null
        }
        show={showModal}
        setShow={setShowModal}
      />
    </div>
  );
}

export default Branding;
