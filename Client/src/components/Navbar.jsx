import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className='fixed z-50 w-full backdrop-blur-md bg-[rgba(20,20,20,0.5)] border-b border-[rgba(255,255,255,0.1)] flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 shadow-lg'>
      
      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className='w-32 sm:w-44 cursor-pointer'
        onClick={() => navigate('/')}
      />

      {/* User Button / Sign In */}
      {user ? (
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: 'border-2 border-[#FF61C5]',
              userButtonAvatar: 'rounded-full',
              userButtonTrigger: 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] backdrop-blur-md text-[#FF61C5]'
            }
          }}
        />
      ) : (
        <button
          onClick={openSignIn}
          className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-gradient-to-r from-[#FF61C5] via-[#6B5BFF] to-[#00FFD1] text-white px-6 sm:px-10 py-2.5 font-medium shadow-md hover:scale-105 transition-transform duration-200'
        >
          Get Started <ArrowRight className='w-4 h-4' />
        </button>
      )}
    </div>
  );
};

export default Navbar;
