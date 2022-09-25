import Info from './pages/info/info';
import Home from './pages/home/home';
import Work from './pages/work/work';
import Other from './pages/other/other';

import './App.css';

function App() {
  return (
    <div id='main' className='main'>

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
