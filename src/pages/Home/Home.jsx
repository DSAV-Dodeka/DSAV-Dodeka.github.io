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

  useEffect(() => {
    setOffset(window.pageYOffset);
    window.onscroll = () => {
        setOffset(window.pageYOffset);
        try {
          document.getElementById("home_logo").style.width = Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + 'rem';
          document.getElementById("home_logo").style.marginLeft = Math.min(6, (4 + (offset / maxOffset) * 2)) + 'rem';
          document.getElementById("home_logo").style.top = Math.max(0.5, 6 - (offset / maxOffset) * 5) + 'rem';
        } catch {}
    }
      try {
        document.getElementById("home_logo").style.width = Math.max(6, logoMax - (offset / maxOffset) * (logoMax - 6)) + 'rem';
        document.getElementById("home_logo").style.marginLeft = Math.min(6, (4 + (offset / maxOffset) * 2)) + 'rem';
        document.getElementById("home_logo").style.top = Math.max(0.5, 6 - (offset / maxOffset) * 5) + 'rem';
      } catch {}
    
  }, [offset]);

  return (
    <div>
      <TitleBar />
      <HomePromo />
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
    </div>
  );
}

export default Home;
