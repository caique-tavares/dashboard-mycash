import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PageTransition } from './components/ui/PageTransition';
import { Dashboard } from './pages/Dashboard';
import { Cards } from './pages/Cards';
import { Transactions } from './pages/Transactions';
import { Goals } from './pages/Goals';
import { Profile } from './pages/Profile';

export const AppRouter = () => {
  return (
    <MainLayout>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </PageTransition>
    </MainLayout>
  );
};