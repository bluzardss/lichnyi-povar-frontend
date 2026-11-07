import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RecipePage from './pages/RecipePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/history" element={<HistoryPage />} />
        {/* Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
