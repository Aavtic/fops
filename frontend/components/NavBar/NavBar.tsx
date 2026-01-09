"use client"

import Link from 'next/link';

import { useEffect, useState } from 'react'
import { MeEndpoint } from '@/lib/http/endpoints'

const Navbar = () => {
    const [profileLink, setProfileLink] = useState('/login');

    useEffect(() => {
        fetch(MeEndpoint, {
            credentials: "include",
        })
        .then(res => {
            if (res.ok) {
                res.json().then(json => {
                    setProfileLink(`/users/${json.user_id}`);
                })
            } else {
                setProfileLink('/login');
            }
        })
    }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          
          {/* LEFT: Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Logo - Using a simplified version of your FOPS SVG */}
            <Link href="/" className="flex items-center gap-2 group">
              <svg className="h-8 w-8" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                 <g transform="translate(250, 220) scale(0.8)">
                    <path d="M 0,-150 L 20,-150 L 30,-130 L 50,-130 L 60,-150 L 90,-140 L 85,-115 L 100,-100 L 125,-105 L 135,-80 L 110,-65 L 120,-45 L 145,-50 L 150,-20 L 125,-10 L 125,10 L 150,20 L 145,50 L 120,45 L 110,65 L 135,80 L 125,105 L 100,100 L 85,115 L 90,140 L 60,150 L 50,130 L 30,130 L 20,150 L 0,150 A 150,150 0 0,0 0,-150 Z" fill="#EA4335" />
                    <path d="M -5,-145 A 145,145 0 0,0 -145,-5 L -5,-5 L -5,-35 A 25,25 0 1,1 -5,-85 L -5,-145 Z" fill="#4285F4" />
                    <path d="M -5,5 L -145,5 A 145,145 0 0,0 -5,145 L -5,85 A 25,25 0 1,0 -5,35 L -5,5 Z" fill="#FBBC05" />
                 </g>
              </svg>
              <span className="font-bold text-slate-700 tracking-tight group-hover:text-black transition-colors">FOPS</span>
            </Link>

            {/* Nav Items */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Problems
              </Link>

              <Link 
                href="/leaderboard" 
                className="text-sm font-medium text-slate-600 hover:text-green-600 transition-colors"
              >
                Leaderboard
              </Link>

              <Link 
                href="/create/problem" 
                className="text-sm font-medium text-slate-600 hover:text-red-500 transition-colors"
              >
                Create
              </Link>
            </div>
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2.5 pl-10 text-sm text-slate-900 bg-slate-100 rounded-full border border-transparent focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 focus:outline-none transition-all placeholder-slate-400" 
                placeholder="Search problems..." 
                required 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Profile */}
          <div className="flex items-center">
            <Link href={profileLink} className="group flex items-center gap-2 pl-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 p-[2px] transition-transform group-hover:scale-105">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {/* Placeholder Avatar Image or Initials */}
                    <img 
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aavtic" 
                        alt="User" 
                        className="h-full w-full object-cover" 
                    />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
