import Info from './pages/info/info';
import Home from './pages/home/home';
import Work from './pages/work/work';
import Other from './pages/other/other';
import Nav from './components/nav/nav';

import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
  }, []);

  return (
    <div id='main' className='main'>
      <Nav />

      <div className='bg'>
      </div>
      <div className='bg-dark'>
      </div>

      <Home pos={1} />
      <Info pos={2} />
      <Work pos={3} />
      <Other pos={4} />

    </div>
  );
}

export default App;
