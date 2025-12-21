"use client"; // Required for client-side hooks

import React, { useEffect, useState } from 'react';
import EditorPage from "@/components/EditorPage/EditorPage";
import LoadingPage from '@/components/Loading/LoadingPage';
import PleaseLogin from '@/components/auth/PleaseLogin'
import { apiFetch } from "@/lib/http/client";
import { AllProblemEndpoint } from '@/lib/http/endpoints';
import { ProblemDetailsResponse } from "@/lib/responses/responses";

export default function ProblemPage({ params }: { params: Promise<{ problemNameslug: string }> }) {
    // State management
    const [problemData, setProblemData] = useState<ProblemDetailsResponse | null>(null);
    const [errorState, setErrorState] = useState<{ notFound: boolean; serverError: boolean, unAuthorized: boolean}>({
        notFound: false,
        serverError: false,
        unAuthorized: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Unwrap the params
                const { problemNameslug } = await params;

                // 2. Perform the fetch
                // Browser automatically attaches HttpOnly cookies due to credentials: "include"
                const response = await apiFetch(`${AllProblemEndpoint}/${problemNameslug}`);

                if (response.status === 200) {
                    const json: ProblemDetailsResponse = await response.json();
                    setProblemData(json);
                } else if (response.status === 401) {
                    setErrorState({ notFound: false, serverError: false, unAuthorized: true});
                } else if (response.status === 404) {
                    setErrorState({ notFound: true, serverError: false, unAuthorized: false});
                } else {
                    setErrorState({ notFound: false, serverError: true, unAuthorized: false});
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorState({ notFound: false, serverError: true, unAuthorized: false});
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params]);

    // 3. Conditional Rendering
    if (isLoading) {
        return <LoadingPage message="Fetching problem details..." />;
    }

    if (errorState.unAuthorized) {
        return (
            <PleaseLogin />
        )
    }

    if (errorState.notFound) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <h1 className="text-xl font-bold text-red-600">Page Not Found</h1>
            </div>
        );
    }

    if (errorState.serverError || !problemData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <h1 className="text-xl font-bold text-red-600">Oops... Server Error!</h1>
            </div>
        );
    }

    return (
        <div>
            <EditorPage 
                problem_id={problemData.id} 
                title={problemData.title} 
                description_html={problemData.description_html} 
                codeTemplate={problemData.code_template}
            />
        </div>
    );
}
