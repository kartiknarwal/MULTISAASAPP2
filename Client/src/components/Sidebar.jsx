import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { FileText, House, LogOut, Mail, Presentation, Users, BookOpen, StickyNote, ClipboardCheck } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/summarizer', label: 'Summarizer', Icon: BookOpen },
  { to: '/ai/meeting-notes', label: 'Meeting Notes', Icon: StickyNote },
  { to: '/ai/research-assistant', label: 'Research Assistant', Icon: ClipboardCheck },
  { to: '/ai/email-composer', label: 'Email Composer', Icon: Mail },
  { to: '/ai/slide-deck', label: 'Slide Deck Generator', Icon: Presentation },
  { to: '/ai/resume-matcher', label: 'Resume Matcher', Icon: FileText },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-[rgba(20,20,20,0.5)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] flex flex-col justify-between items-center
        max-sm:absolute top-14 bottom-0
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
        transition-all duration-300 ease-in-out rounded-xl shadow-lg`}
    >
      {/* User info and nav */}
      <div className="my-7 w-full">
        <img
          src={user?.imageUrl}
          className="w-14 h-14 rounded-full mx-auto border-2 border-[#FF61C5]"
          alt="User avatar"
        />
        <h1 className="mt-2 text-center text-[#FF61C5] font-semibold">{user?.fullName}</h1>

        <div className="px-6 mt-5 text-sm font-medium space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF61C5] via-[#6B5BFF] to-[#00FFD1] text-white shadow-md'
                    : 'text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.05)] hover:backdrop-blur-sm'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full p-4 px-7 flex items-center justify-between border-t border-[rgba(255,255,255,0.1)]">
        <div onClick={openUserProfile} className="flex gap-2 items-center cursor-pointer">
          <img
            src={user?.imageUrl}
            className="w-8 h-8 rounded-full border-2 border-[#FF61C5]"
            alt=""
          />
          <div>
            <h1 className="text-sm font-medium text-[#FF61C5]">{user?.fullName}</h1>
            <p className="text-xs text-[#6B5BFF]">
              <Protect plan="premium" fallback="Free" /> Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-5 h-5 text-[#FF61C5] hover:text-[#00FFD1] transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
