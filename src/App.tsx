import { Route, Routes } from 'react-router';
import Home from './pages/home';
import VerticalSpreads from './pages/verticalSpreads';
import Login from './pages/login';
import Layout from './pages/layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vertical-spreads" element={<VerticalSpreads />} />
      </Route>
    </Routes>
  );
}

export default App;
