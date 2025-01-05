import React, {useState, useEffect} from "react";
import HomeNieuws from './components/HomeNieuws';
import TitleBar from './components/TitleBar';
import HomeTrainingen from './components/HomeTrainingen';
import HomeCommissies from './components/HomeCommissies';
import HomePromo from './components/HomePromo';
import "./Home.scss";
import getUrl from "../../functions/links";

const maxOffset = 24 * parseFloat(getComputedStyle(document.documentElement).fontSize);
const logoMax = Math.min((6 * window.innerWidth / 15), 614.4) / parseFloat(getComputedStyle(document.documentElement).fontSize);

function Home() {
  const [offset, setOffset] = useState(0);
  const snowContent = ['&#127846', '🍉', '🍸'];
  

  const random = (num) => {
    return Math.floor(Math.random() * num);
  }

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
  }

  const createSnow = (n) => {
    for (var i = 0; i < n; i++) {
      var snowContainer = document.getElementById("sneeuw_container");
      while(!snowContainer) {
        snowContainer = document.getElementById("sneeuw_container");
      } 
      var snow = document.createElement("div");
      snow.className = "snow";
      snow.style.cssText = getRandomStyles();
      snow.innerHTML = snowContent[random(3)]
      snowContainer.append(snow);
    }
  }

  
  useEffect(() => {
    
    window.addEventListener("load", () => {
      createSnow(50)
    });
  }, [])

  useEffect(() => {
    setOffset(window.pageYOffset);
    window.onscroll = () => {
        setOffset(window.pageYOffset);
        try {
          document.getElementById("home_logo").style.width = Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + 'rem';
          document.getElementById("home_logo").style.marginLeft = Math.max(2, (4 - (offset / maxOffset) * 2)) + 'rem';
          document.getElementById("home_logo").style.top = Math.max(0.5, 6 - (offset / maxOffset) * 5) + 'rem';
        } catch {}
    }
      try {
        document.getElementById("home_logo").style.width = Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + 'rem';
        document.getElementById("home_logo").style.marginLeft = Math.max(2, (4 - (offset / maxOffset) * 2)) + 'rem';
        document.getElementById("home_logo").style.top = Math.max(0.5, 6 - (offset / maxOffset) * 5) + 'rem';
      } catch {}
    
  }, [offset]);

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
