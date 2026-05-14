import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LinkSleeperPage from './pages/LinkSleeperPage';
import DashboardPage from './pages/DashboardPage';
import DraftRoomPage from './pages/DraftRoomPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/link-sleeper" element={<LinkSleeperPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/draft/:id" element={<DraftRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
