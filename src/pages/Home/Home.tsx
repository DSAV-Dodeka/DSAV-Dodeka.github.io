import { useState, useEffect } from "react";
import HomeNieuws from "./components/HomeNieuws";
import TitleBar from "./components/TitleBar";
import HomeTrainingen from "./components/HomeTrainingen";
import HomeCommissies from "./components/HomeCommissies";
import "./Home.scss";
// import { fontSize, innerWidth } from "../../functions/sizes";

function Home() {
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(400);
  const [logoMax, setLogoMax] = useState(40);
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

  const createSnow = (n) => {
    for (var i = 0; i < n; i++) {
      var snowContainer = document.getElementById("sneeuw_container");
      while (!snowContainer) {
        snowContainer = document.getElementById("sneeuw_container");
      }
      var snow = document.createElement("div");
      snow.className = "snow";
      snow.style.cssText = getRandomStyles();
      snow.innerHTML = snowContent[random(3)];
      snowContainer.append(snow);
    }
  };
  useEffect(() => {
    const fontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const handleResize = () => {
      const innerWidth = window.innerWidth;
      const newLogoMax = Math.min((6 * innerWidth) / 15, 614.4) / fontSize;

      console.log(`logomax=${newLogoMax} maxoff=${fontSize * 24}`);
      setLogoMax(newLogoMax);
    };

    const innerWidth = window.innerWidth;
    const newLogoMax = Math.min((6 * innerWidth) / 15, 614.4) / fontSize;

    console.log(`logomax=${newLogoMax} maxoff=${fontSize * 24}`);
    setLogoMax(newLogoMax);

    setMaxOffset(24 * fontSize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("load", () => {
      createSnow(50);
    });
  }, []);

  useEffect(() => {
    setOffset(window.pageYOffset);
    window.onscroll = () => {
      setOffset(window.pageYOffset);
      try {
        document.getElementById("home_logo").style.width =
          Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + "rem";
        document.getElementById("home_logo").style.marginLeft =
          Math.max(2, 4 - (offset / maxOffset) * 2) + "rem";
        document.getElementById("home_logo").style.top =
          Math.max(0.5, 6 - (offset / maxOffset) * 5) + "rem";
      } catch {}
    };
    try {
      document.getElementById("home_logo").style.width =
        Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + "rem";
      document.getElementById("home_logo").style.marginLeft =
        Math.max(2, 4 - (offset / maxOffset) * 2) + "rem";
      document.getElementById("home_logo").style.top =
        Math.max(0.5, 6 - (offset / maxOffset) * 5) + "rem";
    } catch {}
  }, [offset, maxOffset, logoMax]);

  return (
    <div>
      <TitleBar />
      {/* <HomePromo /> */}
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
      <div id="sneeuw_container"></div>
    </div>
  );
}

export default Home;
