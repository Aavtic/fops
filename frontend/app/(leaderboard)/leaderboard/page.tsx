import React from 'react';

import { apiFetch } from '@/lib/http/client'
import { GetLeaderboardEndpoint } from '@/lib/http/endpoints'

import { ErrorPage } from '@/components/Error/ErrorPage'

// 1. Type Definition
interface LeaderboardEntry {
  username: string;
  user_id: string;
  score: number;
  since: string;
}

// 3. Helper Component for Rank Icons
const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-2xl">🥇</span>; // You can replace these with custom SVGs if you prefer
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-slate-500 font-bold w-6 text-center">{rank}</span>;
};

// 4. Date Formatter
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default async function LeaderboardPage() {
    let leaderboard: LeaderboardEntry[] = [];

    const response = await apiFetch(GetLeaderboardEndpoint)
    if (response.status === 200) {
        leaderboard = await response.json()
    } else if (response.status === 500) {
        return <ErrorPage message={"Could not retrieve Leaderboard at this time. Please try again later"} onRetry={() => {location.reload()}}/>
    }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Container */}
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Global Leaderboard
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Top performers and problem solvers on FOPS.
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-5">User</div>
            <div className="col-span-2 sm:col-span-3 text-right">Score</div>
            <div className="col-span-2 sm:col-span-3 text-right hidden sm:block">Joined</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              
              return (
                <div 
                  key={user.user_id} 
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150 group"
                >
                  
                  {/* Rank Column */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                    <RankIcon rank={rank} />
                  </div>

                  {/* User Column */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {/* You can use your actual SVG path here */}
                      <img 
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} 
                        alt={user.username} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold truncate ${rank === 1 ? 'text-slate-900' : 'text-slate-700'}`}>
                        {user.username}
                      </span>
                      {rank === 1 && (
                         <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Leader</span>
                      )}
                    </div>
                  </div>

                  {/* Score Column */}
                  <div className="col-span-2 sm:col-span-3 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-blue-50 text-blue-700">
                      {user.score.toLocaleString()}
                    </span>
                  </div>

                  {/* Date Column (Hidden on mobile) */}
                  <div className="col-span-2 sm:col-span-3 text-right hidden sm:block">
                    <span className="text-sm text-slate-400 font-medium">
                      {formatDate(user.since)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Empty State (Optional: if array is empty) */}
          {leaderboard.length === 0 && (
             <div className="p-12 text-center text-slate-400">
                No users found.
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
