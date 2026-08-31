import { Route, Routes } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/home';
import VerticalSpreads from './pages/verticalSpreads';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vertical-spreads" element={<VerticalSpreads />} />
      </Routes>
    </>
  );
}

export default App;
