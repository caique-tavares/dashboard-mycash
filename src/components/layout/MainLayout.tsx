import { ReactNode } from 'react';
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

  return (
    <div className="min-h-screen bg-background-400">
      <Sidebar />

      {/* Desktop: três seções lado a lado */}
      <div className="hidden lg:flex flex-row min-h-screen">
        {/* Dashboard Central */}
        <main
          key={isExpanded ? 'expanded' : 'collapsed'}
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isExpanded ? 'lg:ml-[300px]' : 'lg:ml-[100px]'
          }`}
        >
          <div className="max-w-[1400px] xl:max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Widgets à Direita - apenas em telas xl+ */}
        <aside className="hidden xl:block w-80 xl:w-96 bg-background-400 p-4 md:p-6 lg:p-8 border-l border-stroke-4 space-y-6 overflow-y-auto">
          <CreditCardsWidget />
          <UpcomingExpensesWidget />
        </aside>
      </div>

      {/* Tablet e Mobile: Header + conteúdo principal */}
      <div className="lg:hidden">
        <Header />
        <main className="pt-16 p-4 md:p-6">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};