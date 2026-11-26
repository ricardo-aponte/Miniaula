import { useState } from 'react';
import { Link } from 'react-router';
import { SITE_TITLE } from '../config/navigation';

const Chevron = ({ open }) => (
  <svg
    className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const MenuItem = ({ item, isMobile, isOpen, onToggle, onNavigate }) => {
  if (!item.children) {
    return (
      <Link
        to={item.href}
        className={isMobile ? 'text-white' : 'text-slate-100 hover:text-white'}
        onClick={onNavigate}
      >
        {item.name}
      </Link>
    );
  }

  const submenuPosition = item.align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-1 text-slate-100"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.name}
        <Chevron open={isOpen} />
      </button>
      {isOpen && (
        <div
          className={
            isMobile
              ? 'flex flex-col gap-2 pl-4'
              : `absolute top-full mt-2 min-w-48 rounded-b-md border border-slate-700 bg-slate-800 py-2 shadow-lg ${submenuPosition}`
          }
        >
          {item.children.map((child) => (
            <Link
              key={`submenu-${child.name}`}
              to={child.href}
              className={
                isMobile
                  ? 'text-slate-300'
                  : 'block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white'
              }
              onClick={onNavigate}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Navbar reutilizable: recibe los ítems de cada página (inicio o acceso).
const SiteNavbar = ({ items, title = SITE_TITLE }) => {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (name) => {
    setOpenSubmenu((current) => (current === name ? null : name));
  };

  const closeMenu = () => {
    setOpenSubmenu(null);
    setOpen(false);
  };

  const toggleMobileMenu = () => {
    if (open) setOpenSubmenu(null);
    setOpen((current) => !current);
  };

  const renderItems = (isMobile) =>
    items.map((item) => (
      <MenuItem
        key={`${isMobile ? 'mobile' : 'desktop'}-${item.name}`}
        item={item}
        isMobile={isMobile}
        isOpen={openSubmenu === item.name}
        onToggle={() => toggleSubmenu(item.name)}
        onNavigate={isMobile ? closeMenu : () => setOpenSubmenu(null)}
      />
    ));

  return (
    <nav className="relative z-50 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-14 items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-white" onClick={closeMenu}>
            {title}
          </Link>

          <button
            type="button"
            className="cursor-pointer rounded-md border border-slate-600 px-3 py-2 text-slate-300 hover:text-white lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Alternar navegación"
            aria-expanded={open}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-6 lg:flex">{renderItems(false)}</div>
        </div>

        {open && (
          <div className="flex flex-col gap-3 border-t border-slate-700 py-4 lg:hidden">
            {renderItems(true)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SiteNavbar;
