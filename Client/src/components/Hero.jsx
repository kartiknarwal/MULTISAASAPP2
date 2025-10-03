import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div
            className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center min-h-screen"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${assets.gradientBackground})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div className="text-center mb-8">
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold mx-auto leading-[1.2] text-white'>
                    Unlock Your <br />
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'>Creative Potential</span>
                </h1>

                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto text-gray-300 text-sm sm:text-base'>
                    From writing articles to generating stunning visuals and summarizing ideas, let AI simplify your creative process and elevate your projects.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
                <button
                    onClick={() => navigate("/ai")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition cursor-pointer font-semibold"
                >
                    Start Creating
                </button>
                <button
                    className="bg-transparent text-white px-10 py-3 rounded-lg border border-gray-400 hover:bg-gray-700 hover:border-gray-500 transition cursor-pointer font-medium"
                >
                    Watch Demo
                </button>
            </div>

            <div className="flex items-center gap-4 mt-10 mx-auto text-gray-400 text-sm sm:text-base">
                <img src={assets.user_group} alt="" className='h-8' />
                Trusted by 10+ leading creative teams
            </div>
        </div>
    );
};

export default Hero;
