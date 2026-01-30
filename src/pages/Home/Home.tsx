import { useState, useEffect } from "react";
import HomeNieuws from "./components/HomeNieuws";
import TitleBar from "./components/TitleBar";
import HomeTrainingen from "./components/HomeTrainingen";
import HomeCommissies from "./components/HomeCommissies";
import "./Home.scss";
import Samenwerkingen from "./components/Samenwerkingen";
// import { fontSize, innerWidth } from "../../functions/sizes";

function Home() {
  const snowContent = ["&#127846", "🍉", "🍸"];

  const random = (num: number) => {
    return Math.floor(Math.random() * num);
  };

  const getRandomStyles = () => {
    const top = random(100) - 20;
    const left = random(100);
    const dur = random(10) + 15;
    const size = random(25) + 10;
    return `
      top: -${top}%;
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${dur}s;
    `;
  };

  const createSnow = (n: number) => {
    for (var i = 0; i < n; i++) {
      var snowContainer = document.getElementById("sneeuw_container");
      while (!snowContainer) {
        snowContainer = document.getElementById("sneeuw_container");
      }
      var snow = document.createElement("div");
      snow.className = "snow";
      snow.style.cssText = getRandomStyles();
      snow.innerHTML = snowContent[random(3)]!;
      snowContainer.append(snow);
    }
  };

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollY = window.pageYOffset;
      const maxOffset = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--max-offset",
        ),
      );
      const progress = Math.min(scrollY / maxOffset, 1);
      document.documentElement.style.setProperty(
        "--scroll-progress",
        progress.toString(),
      );
    };

    const updateLogoMax = () => {
      const fontSize = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const newLogoMax =
        Math.min((6 * window.innerWidth) / 15, 614.4) / fontSize;

      document.documentElement.style.setProperty(
        "--logo-max",
        `${newLogoMax}rem`,
      );
      document.documentElement.style.setProperty(
        "--max-offset",
        `${24 * fontSize}px`,
      );
    };

    // Initial setup
    updateLogoMax();
    updateScrollProgress();

    // Event listeners
    const handleScroll = () => updateScrollProgress();
    const handleResize = () => {
      updateLogoMax();
      updateScrollProgress();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <TitleBar />
      {/* <HomePromo /> */}
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
      <Samenwerkingen />
      <div id="sneeuw_container"></div>
    </div>
  );
}

export default Home;
