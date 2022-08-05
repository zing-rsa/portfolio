import Skills from './pages/skills/skills';
import Home from './pages/home/home';
import Work from './pages/work/work';
import Other from './pages/other/other';

import './App.css';

function App() {
  return (
    <div className='main'>

      <div className='bg'>
      </div>
      <div className='bg-dark'>
      </div>

      <Home />
      <Work />
      <Skills />
      <Other />

    </div>
  );
}

export default App;
