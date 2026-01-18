import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  // Estado para mobile/tablet (overlay)
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Estado para desktop (expandido/colapsado)
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Desktop começa expandido

  // Fecha sidebar mobile ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <SidebarContext.Provider value={{
      isOpen,
      toggleSidebar,
      closeSidebar,
      isExpanded,
      toggleExpanded
    }}>
      {children}
    </SidebarContext.Provider>
  );
};