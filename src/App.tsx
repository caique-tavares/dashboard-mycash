import { BrowserRouter as Router } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { FilterProvider } from './contexts/FilterContext';
import { AppRouter } from './AppRouter';
import { mockTransactions, mockBankAccounts, mockCreditCards } from './data/mockData';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <FilterProvider>
          <FinancialProvider
            transactions={mockTransactions}
            bankAccounts={mockBankAccounts}
            creditCards={mockCreditCards}
          >
            <AppRouter />
          </FinancialProvider>
        </FilterProvider>
      </SidebarProvider>
    </Router>
  );
}

export default App;