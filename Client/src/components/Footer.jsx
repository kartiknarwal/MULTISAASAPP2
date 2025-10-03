import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full text-gray-400 mt-20 bg-gradient-to-b from-gray-900 via-black to-gray-950">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-8">
        {/* Logo + Description */}
        <div className="md:max-w-96">
          <img className="h-9" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            Experience the power of AI with <span className="text-white font-semibold">QuickAi</span>.
            <br />
            Transform your workflow with tools to write articles,
            generate images, and boost productivity.
          </p>
        </div>

        {/* Links + Newsletter */}
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-white">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:text-white transition" href="/">Home</a></li>
              <li><a className="hover:text-white transition" href="/about">About us</a></li>
              <li><a className="hover:text-white transition" href="/contact">Contact us</a></li>
              <li><a className="hover:text-white transition" href="/privacy">Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-2">
              <p className="text-gray-400">
                Get the latest AI updates, tips, and resources straight to your inbox.
              </p>
              <div className="flex items-center gap-2 pt-4">
                <input
                  className="bg-white/5 border border-white/20 placeholder-gray-400 
                             focus:ring-2 focus:ring-indigo-500 text-gray-200 
                             outline-none w-full max-w-64 h-9 rounded px-3"
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 w-24 h-9 text-white rounded cursor-pointer transition"
                  aria-label="Subscribe"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-6 text-center text-xs md:text-sm pb-6 text-gray-500">
        © 2025 <span className="text-white font-medium">Kartik Narwal</span>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
