import HomeNieuws from './components/HomeNieuws';
import TitleBar from './components/TitleBar';
import HomeTrainingen from './components/HomeTrainingen';
import HomeCommissies from './components/HomeCommissies';

function Home() {
  return (
    <div>
      <TitleBar />
      <HomeNieuws />
      <HomeTrainingen />
      <HomeCommissies />
    </div>
  );
}

export default Home;
