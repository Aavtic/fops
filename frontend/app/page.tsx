"use client"

import { apiFetch } from '@/lib/http/client'
import { AllProblemEndpoint } from '@/lib/http/endpoints'
import Link from 'next/link';

import LoadingPage from '@/components/Loading/LoadingPage'
import PleaseLogin from '@/components/auth/PleaseLogin'
import { ErrorPage } from '@/components/Error/ErrorPage'

import { useAuth } from '@/lib/utils/utils'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';


export interface Problem {
  uid: string;
  title: string;
  title_slug: string;
  description: string;
}

export interface ProblemData {
  problems: Problem[];
}

function ProblemList(p_data:  {data: ProblemData}) {
    const data = p_data.data;

    return (

<div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* CONTAINER: 
          1. 'flex flex-col md:flex-row': Stacks on mobile, Side-by-side on desktop
          2. 'items-center': Vertically centers the text with the image
          3. 'gap-6': Adds space between the image and text
          4. 'mb-8': Bottom margin for the whole group
      */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        
        {/* GIF Section */}
        {/* shrink-0 prevents the image from getting squashed if text is long */}
        <div className="shrink-0">
          <img 
            src="3d-inequality.gif" 
            alt="Coding Animation" 
            // I changed h-80 to h-32 so it matches the text height better
            className="h-32 w-auto rounded-xl shadow-sm bg-white" 
          />
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Coding Challenges</h1>
          <p className="text-gray-500 mt-2">Master your logic with these fundamental problems.</p>
        </div>

      </div>

      {/* The rest of your content (challenges list) would go here */}

      <div className="space-y-4">
        {data.problems.map((problem) => (
          /* Use Link component for redirection */
          <Link 
            href={`/solve/${problem.title_slug}`} 
            key={problem.uid}
            className="block group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-400 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {/* <Code2 size={24} /> */}
                  <span>{`</>`}</span> 
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    {problem.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      # {problem.title_slug}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center self-center text-gray-300 group-hover:text-blue-500 transition-colors">
                 <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProblemsPage() {
    const router = useRouter()
    const [state, setState] = useState('loading');
    const [data, setData] = useState<ProblemData>()

    useEffect(() => {
        apiFetch(AllProblemEndpoint)
        .then(response => {
            if (!response.ok) {
                setState('error');
                return;
            }
            if (response.status === 200) {
                return response.json()
            } else {
            }
        })
        .then(json => {
            const data: ProblemData = json
            setData(data)
            setState('success')
        })
        .catch(err => {
            console.log('ERROR: ', err);
            setState('error')
        })
    }, [])

    return (
        (state === 'loading') ? (
            <LoadingPage message="Loading Problems..." />
        ) : (state === 'success') ? (
            <ProblemList data={data!}/>
        ) : (
            <ErrorPage message="Something went wrong while fetching the information. Please check your connection and try again." onRetry={() => router.refresh()} />
        )
    )
}

export default function Home() {
    const { loggedIn, loading } = useAuth();
    // const router = useRouter();

    // useEffect(() => {
    //     if (loading) return;
    //
    //     if (!loggedIn) {
    //         console.log('User not found after check, redirecting...');
    //         router.replace("/login");
    //     }
    // }, [loading, loggedIn, router]);
    //


    if (loading) {
        return <LoadingPage message="Verifying your session..." />;
    }

    if (!loggedIn) {
        return <PleaseLogin />
    }

    if (!loggedIn) {
        return null; 
    }

    return <ProblemsPage />;
}
