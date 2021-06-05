import HomeNieuws from './components/HomeNieuws';
import TitleBar from './components/TitleBar';
import HomeTrainingen from './components/HomeTrainingen';
import HomeCommissies from './components/HomeCommissies';
import HomeSponsors from './components/HomeSponsors';

function Home() {
  return (
    <div>
      <TitleBar />
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
      <HomeSponsors />
    </div>
  );
}

export default Home;
