import { apiFetch } from '@/lib/http/client'
import { AllProblemEndpoint } from '@/lib/http/endpoints'
import Link from 'next/link';


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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coding Challenges</h1>
        <p className="text-gray-500 mt-2">Master your logic with these fundamental problems.</p>
      </div>

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


export default async function Home() {
    const response = await apiFetch(AllProblemEndpoint)
    if (response.status === 200) {
        const data: ProblemData = await response.json()
        return (
            <div>
            <ProblemList  data={data}/>
            </div>
        );
    } else {
        return (
            <div>
            <h1>Oops. Error fetching data</h1>
            </div>
        );
    }
}
