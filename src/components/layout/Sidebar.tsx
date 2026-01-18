import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Cartões', href: '/cards', icon: '💳' },
  { name: 'Transações', href: '/transactions', icon: '💰' },
  { name: 'Metas', href: '/goals', icon: '🎯' },
  { name: 'Perfil', href: '/profile', icon: '👤' },
];

export const Sidebar = () => {
  const { isOpen, closeSidebar, isExpanded, toggleExpanded } = useSidebar();

  const handleLinkClick = () => {
    // Fecha a sidebar em dispositivos móveis/tablet ao clicar em um link
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Desktop: Sidebar expandível/colapsável */}
      <div
        className={`hidden lg:block bg-surface-500 h-screen fixed left-0 top-0 shadow-card transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-sidebar-width' : 'w-25'
        }`}
      >
        <div className={`h-full overflow-y-auto relative ${isExpanded ? 'p-sidebar-padding' : 'py-8 px-3'} ${!isExpanded ? 'overflow-visible' : ''}`}>
          <SidebarContent
            isExpanded={isExpanded}
            onLinkClick={handleLinkClick}
          />
        </div>

        {/* Botão de toggle */}
        <button
          onClick={toggleExpanded}
          className={`absolute top-8 w-10 h-10 bg-primary-500 border-2 border-primary-500 rounded-full flex items-center justify-center shadow-card hover:bg-primary-600 hover:scale-110 transition-all duration-200 animate-pulse z-30 ${
            isExpanded ? '-right-4' : 'left-24'
          }`}
          aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          <svg
            className={`w-5 h-5 text-secondary-900 transition-transform duration-300 ${
              isExpanded ? 'rotate-0' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Tablet/Mobile: Sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Overlay escuro */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeSidebar}
        />

        {/* Sidebar content */}
        <div className="relative w-sidebar-width bg-surface-500 h-screen shadow-card">
          <div className="p-sidebar-padding h-full overflow-y-auto">
            <SidebarContent
              isExpanded={true}
              onLinkClick={handleLinkClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

interface SidebarContentProps {
  isExpanded: boolean;
  onLinkClick?: () => void;
}

const SidebarContent = ({ isExpanded, onLinkClick }: SidebarContentProps) => {
  const location = useLocation();

  return (
    <>
      {/* Logo */}
      <div className="mb-sidebar-gap-vertical flex items-center justify-center">
        {isExpanded ? (
          <div className="flex items-center">
            <span className="text-heading-md font-bold text-secondary-900">MyCash</span>
            <span className="text-heading-sm font-bold text-primary-500">+</span>
          </div>
        ) : (
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-secondary-900">M</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <SidebarNavItem
              key={item.name}
              item={item}
              isActive={isActive}
              isExpanded={isExpanded}
              onClick={onLinkClick}
            />
          );
        })}
      </nav>

      {/* Members section */}
      <div className="mt-sidebar-gap-vertical">
        {isExpanded && (
          <h3 className="text-label-md font-semibold text-secondary-900 mb-4">Família</h3>
        )}
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold text-secondary-900 mr-3">
              P
            </div>
            {isExpanded && <span className="text-sm text-secondary-900">Pai</span>}
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center text-sm font-bold text-secondary-900 mr-3">
              M
            </div>
            {isExpanded && <span className="text-sm text-secondary-900">Mãe</span>}
          </div>
          <button className="flex items-center text-primary-500 hover:text-primary-600">
            <div className="w-8 h-8 border-2 border-dashed border-primary-500 rounded-full flex items-center justify-center mr-3">
              +
            </div>
            {isExpanded && <span className="text-sm">Adicionar</span>}
          </button>
        </div>
      </div>
    </>
  );
};

interface SidebarNavItemProps {
  item: { name: string; href: string; icon: string };
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

const SidebarNavItem = ({ item, isActive, isExpanded, onClick }: SidebarNavItemProps) => {
  return (
    <div className="relative group">
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary-500 text-secondary-900 shadow-card'
            : 'text-secondary-900 hover:bg-gray-100'
        } ${isExpanded ? 'justify-start' : 'justify-center'}`}
      >
        <span
          className={`text-xl transition-colors duration-200 ${
            isActive ? 'text-secondary-900' : 'text-secondary-900'
          }`}
        >
          {item.icon}
        </span>
        {isExpanded && (
          <span className={`ml-3 font-medium transition-all duration-200 ${
            isActive ? 'opacity-100' : 'opacity-90'
          }`}>
            {item.name}
          </span>
        )}
      </Link>

      {/* Tooltip para sidebar colapsada */}
      {!isExpanded && (
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 pointer-events-none z-50">
          <div className="bg-secondary-900 text-surface-500 px-3 py-2 rounded-lg shadow-card whitespace-nowrap">
            <span className="text-sm font-medium">{item.name}</span>
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-secondary-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};
