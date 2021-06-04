import HomeNieuws from './components/HomeNieuws';
import TitleBar from './components/TitleBar';
import HomeTrainingen from './components/HomeTrainingen';

function Home() {
  return (
    <div>
      <TitleBar />
      <HomeNieuws />
      <HomeTrainingen />
    </div>
  );
}

export default Home;
