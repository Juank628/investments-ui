import { Route, Routes } from 'react-router';
import Home from './pages/home';
import VerticalSpreads from './pages/verticalSpreads';
import Login from './pages/login';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vertical-spreads" element={<VerticalSpreads />} />
      </Routes>
    </>
  );
}

export default App;
