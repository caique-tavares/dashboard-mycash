import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CreditCardsWidget } from '../dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../dashboard/UpcomingExpensesWidget';
import { useSidebar } from '../../contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isExpanded } = useSidebar();
  const location = useLocation();
  const isCardsPage = location.pathname === '/cards';

  return (
    <div className="min-h-screen bg-background-400">
      <Sidebar />

      {/* Desktop: conteúdo principal ocupando toda a tela */}
      <div className="hidden lg:block">
        <Sidebar />
        <main
          key={isExpanded ? 'expanded' : 'collapsed'}
          className={`min-h-screen transition-all duration-300 ease-in-out ${
            isExpanded ? 'lg:ml-[300px]' : 'lg:ml-[100px]'
          }`}
        >
          <div className="p-4 md:p-6 lg:p-8">
            {children}
            {/* Widgets apenas na página Cards */}
            {isCardsPage && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                <CreditCardsWidget />
                <UpcomingExpensesWidget />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Tablet e Mobile: Header + conteúdo principal */}
      <div className="lg:hidden">
        <Header />
        <main className="pt-16 p-4 md:p-6">
          <div className="max-w-full">
            {children}
            {/* Widgets apenas na página Cards */}
            {isCardsPage && (
              <div className="grid grid-cols-1 gap-6 mt-8">
                <CreditCardsWidget />
                <UpcomingExpensesWidget />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};