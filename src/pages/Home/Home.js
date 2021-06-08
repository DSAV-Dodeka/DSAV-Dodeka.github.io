import React, {useState, useEffect} from "react";
import HomeNieuws from './components/HomeNieuws';
import TitleBar from './components/TitleBar';
import HomeTrainingen from './components/HomeTrainingen';
import HomeCommissies from './components/HomeCommissies';
import logo from "../../images/logo.png";
import "./Home.css";

const maxOffset = 24 * parseFloat(getComputedStyle(document.documentElement).fontSize);
const logoMax = Math.min((6 * window.innerWidth / 15), 614.4) / parseFloat(getComputedStyle(document.documentElement).fontSize);

function Home() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
        setOffset(window.pageYOffset);
        console.log((1 - (offset / maxOffset)) * logoMax);
        try {
          document.getElementById("dodeka").style.width = Math.max(6, Math.round(logoMax - (offset / maxOffset) * (logoMax - 6))) + 'rem';
          document.getElementById("dodeka").style.marginLeft = Math.min(6, Math.round((4 + (offset / maxOffset) * 2))) + 'rem';
          document.getElementById("dodeka").style.top = Math.max(0.5, 6 - (offset / maxOffset) * 5) + 'rem';
        } catch {}
    }
  }, [offset]);

  return (
    <div>
      <img id="dodeka" class="hidden lg:block w-2/5 fixed top-24 ml-16 z-50" src={logo} alt=""/>
      <TitleBar />
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
    </div>
  );
}

export default Home;
