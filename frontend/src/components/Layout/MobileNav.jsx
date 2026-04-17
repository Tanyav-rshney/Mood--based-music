import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHomeFilled, MdSearch, MdLibraryMusic } from 'react-icons/md';

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 top-auto left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-borderSubtle py-2 px-6 flex justify-between items-center safe-area-pb">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
          }`
        }
      >
        <MdHomeFilled className="text-2xl" />
        <span className="text-[10px] uppercase font-bold">Home</span>
      </NavLink>
      
      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
          }`
        }
      >
        <MdSearch className="text-2xl" />
        <span className="text-[10px] uppercase font-bold">Search</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
          }`
        }
      >
        <MdLibraryMusic className="text-2xl" />
        <span className="text-[10px] uppercase font-bold">Favorites</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
