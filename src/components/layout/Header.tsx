import { useSidebar } from '../../contexts/SidebarContext';

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-surface-500 shadow-card fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 lg:hidden">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Abrir menu"
      >
        <svg
          className="w-6 h-6 text-secondary-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="text-heading-xs font-bold text-secondary-900">MyCash+</h1>

      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-secondary-900">P</span>
      </div>
    </header>
  );
};