"use client"
import React from 'react';

import { useState, useEffect } from 'react'

import { apiFetch }  from '@/lib/http/client'
import { GetUserDetailsEndpoint } from '@/lib/http/endpoints'

export default function UserPage({ params }: { params: Promise<{ userHash : string }> }) {
    const [userDetails, setUserDetails] = useState({
        username: "Loading...",
        user_rank: "Loading...",
        user_score: 0,
        user_global_score: 0,
        user_solved_problems: 0,
        solved_problems_list: []
    });

    useEffect(() => {
        const res = params.then(parameters => {
            const user_id = parameters.userHash
            console.log(user_id)
            return apiFetch(GetUserDetailsEndpoint.replace("{}", user_id))
        });

        res.then(response => {
            if (response.status === 200) {
                response.json().then(json => {
                    console.log(json)
                    setUserDetails(json);
                })
            } else if (response.status === 404 || response.status === 500 ) {
                setUserDetails(details => ({
                    username: "Not Found!",
                    ...details,
                }));
            } else if (response.status === 204) {
                response.json().then(json => {
                    console.log(json)
                    setUserDetails({
                        username: json.username,
                        user_rank: "Rookie",
                        user_score: 0,
                        user_global_score: 0,
                        user_solved_problems: 0,
                        solved_problems_list: []
                    });
                })
            }
        })
    }, []);

    return (
        // Changed 'justify-center' to 'justify-start'
        // Added 'pt-24' (padding-top) to push it down from the very top
        <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-start pt-24 gap-8 p-6">
          
          {/* The User Card */}
          <div className="w-full max-w-3xl flex justify-center"> 
            <UserCard 
                username={userDetails.username}
                rank={userDetails.user_rank}
                user_score={userDetails.user_score}
                user_global_score={userDetails.user_global_score}
                user_solved_problems={userDetails.user_solved_problems}
            /> 
          </div>

          {/* The Problem List */}
          <div className="w-full max-w-3xl">
            <ProblemsSolved  problems={userDetails.solved_problems_list}/>
          </div>

        </div>
      );
};

function UserCard(user: {
  username: string, 
  rank: string, 
  user_score: number, 
  user_global_score: number, 
  user_solved_problems: number 
}) {
  return (
    <div className="flex items-start gap-8 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all w-full">
      
      {/* 1. Avatar (Fixed on Left) */}
      <div className="relative shrink-0">
        <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-100 shadow-inner">
           <img 
              src="/user-profile.svg" 
              alt={user.username} 
              className="h-full w-full object-cover" 
           />
        </div>
        <span className="absolute bottom-1 right-1 block h-6 w-6 rounded-full bg-green-500 border-4 border-white"></span>
      </div>

      {/* 2. Main Info Column */}
      <div className="flex flex-col w-full">
        
        {/* Row A: Username */}
        <div className="flex items-center justify-between w-full">
          <span className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
            {user.username}
          </span>
          {/* Optional: You could put an 'Edit Profile' button here in the future */}
        </div>
        
        {/* Row B: Rank Badge */}
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 uppercase tracking-wide">
            <svg className="w-4 h-4 mr-1.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {user.rank}
          </span>
        </div>

        {/* Row C: Stats (Moved Below) */}
        <div className="flex items-center gap-12 mt-8 pt-6 border-t border-slate-100">

            {/* Stat 1: Solved */}
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Score
                </span>
                <span className="text-3xl font-black text-slate-800 leading-none">
                    {user.user_score}
                </span>
            </div>
            
            {/* Stat 1: Solved */}
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Problems Solved
                </span>
                <span className="text-3xl font-black text-slate-800 leading-none">
                    {user.user_solved_problems}
                </span>
            </div>

            {/* Stat 2: Global Score */}

            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Global
                </span>
                
                {/* Cleaned up: Removed extra flex-row wrapper */}
                <div className="flex items-baseline gap-1.5">
                    
                    {/* "Top" */}
                    {/* Added leading-none to match the number's line-height */}
                    <span className="text-xl font-bold text-slate-600 leading-none">
                        Top
                    </span>
                    
                    {/* Number */}
                    <span className="text-3xl font-black text-blue-600 tracking-tight leading-none">
                        {user.user_global_score.toLocaleString()}
                    </span>
                    
                    {/* "%" */}
                    {/* Added leading-none */}
                    <span className="text-xl font-bold text-slate-400 leading-none">
                        %
                    </span>
                    
                </div>
            </div>


        </div>

      </div>

    </div>
  )
}

function ProblemsSolved(props: {problems: Array<{ title_slug: string, title: string, date: string, status: string}>}) {
    const problems = props.problems
    return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      
      {/* Section Header */}
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Recent Activity</h3>

      {/* List Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Header Row (Optional, helpful for clarity) */}
        <div className="grid grid-cols-12 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-8">Problem</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100">
          {problems.map((problem, idx) => (
            <div 
              key={idx} 
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150 group"
            >
              
              {/* Problem Title */}
              <div className="col-span-8">
                <a href={`/solve/${problem.title_slug}`} className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                {problem.title}
                </a>
              </div>

              {/* Status Badge */}
              <div className="col-span-2 flex justify-center">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${problem.status === 'solved' 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-amber-50 text-amber-700 border border-amber-100'}
                `}>
                  {problem.status === 'pass' ? (
                    // Checkmark Icon
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (problem.status === 'attempted') ? (
                    // Clock/Dash Icon
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ) : (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  )}
                  {problem.status}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 text-right">
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(problem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
    );
}
