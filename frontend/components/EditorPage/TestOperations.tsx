"use client";

import { Button } from "@/components/ui/button"


import React from 'react';
import { useState, useEffect } from 'react';


// This class string is for an elegant outline/ghost sub button
const subButtonClasses = "py-2.5 px-6 " +
  "text-sm font-semibold " +
  "bg-transparent border-2 border-indigo-600 " +
  "text-indigo-600 rounded-lg " +
  "transition-all duration-300 ease-in-out " +
  "hover:bg-indigo-50 active:bg-indigo-100 " +
  "focus:outline-none focus:ring-4 focus:ring-indigo-500/50 " +
  "active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

const activeButtonClasses = "py-2.5 px-6 " +
  "text-sm font-semibold " +
  "bg-indigo-600 border-2 border-indigo-600 " + // Solid background and border for visual weight
  "text-white rounded-lg " + // White text
  "shadow-md " + // Add a subtle shadow to lift it slightly
  "transition-all duration-300 ease-in-out " +
  "hover:bg-indigo-700 active:bg-indigo-800 " + // Darker hover/active state
  "focus:outline-none focus:ring-4 focus:ring-indigo-500/50 " +
  "active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

// Assuming your Button component and classes are defined elsewhere or imported
// const subButtonClasses = "..."
// const Button = ({ children, variant, className, onClick }) => { ... }

function OperationButton({name, onClickFn, isCurOp}: {name: string, onClickFn: () => any, isCurOp: boolean}) {
    // Note: You should remove className={subButtonClasses} if your Button component
    // already handles the variant="outline" prop correctly, as shown in the previous example.
    return (
        <Button onClick={onClickFn} variant="ghost" className={isCurOp ? activeButtonClasses : subButtonClasses}>
            {name}
        </Button>
    )
}

interface TestCaseResult {
    expected: string;
    got: string;
    input: string;
    ms: number;
}

// 2. Interface for the object inside the 'info.Pass' key
interface PassDetails {
    execution_time: number;
    average_time: number;
    // The 'Pass' key holds an array of TestCaseResult objects
    Pass: TestCaseResult[]; 
}

// 3. Interface for the 'info' object
interface TestInfo {
    // The key here ('Pass') is dynamic based on the status, but in this specific
    // structure, we define it directly. If status could be 'Fail', you might
    // need a union type or a more complex generic structure, but for this JSON:
    Pass: PassDetails;
}

// Interface for the specific kind of failure provided in your example
interface FailDetails {
    ex: string; // Likely Expected
    got: string;
    input: string;
}

// Interface for the custom code error provided
interface CodeErrorDetails {
    error: string;
}

// A. Case for "Pass" Status
interface TestResultsPass {
    status: 'Pass';
    info: {
        Pass: PassDetails;
    };
}

// B. Case for "Fail" Status
interface TestResultsFail {
    status: 'Fail';
    info: {
        Fail: FailDetails;
    };
}

// C. Case for "URCodeErrorLOL" Status
interface TestResultsCodeError {
    status: 'URCodeErrorLOL';
    info: {
        URCodeErrorLOL: CodeErrorDetails;
    };
}

// D. Final Union Type (Handles all possible structures)
export type TestResults = 
    | TestResultsPass 
    | TestResultsFail 
    | TestResultsCodeError;

// 4. Final Interface for the root response object
// export interface TestResults {
//     status: 'Pass' | 'Fail' | 'Error'; // Use a union type for status
//     info: TestInfo;
// }

// 5. Interface for the data prop in your component (if you pass the whole object)
export interface TestResultsProps {
    data: TestResults;
}

export enum Operation {
    ResultOp,
    TestCasesOp,
    SolutionsOp,
    SubmissionOp,
    SettingsOp,
    AnalysisOp,
    NoOp,
}

export interface DataState {
    ResultData: any
}

export interface TestOperationsProps {
    currentOperations: Operation
    setCurOp: React.Dispatch<React.SetStateAction<Operation|undefined>>;
    data: DataState | undefined
    triggerEvent: any
}

// Defined *outside* of the main component's return statement:
const renderContent = (currentOperation: Operation, data: DataState | undefined) => {
    const contentContainerClasses = "h-full p-4 rounded-lg shadow-inner";

    switch (currentOperation) {
        case Operation.ResultOp:
            return (
                <div className={`${contentContainerClasses} bg-green-100`}>
                    {
                        (data === undefined || data?.ResultData === null) ? (<h1>No Results currently</h1>)
                        : (
                            renderResult(data!.ResultData as TestResults)
                        )
                    }
                </div>
            );
        case Operation.TestCasesOp:
            return (
                <div className={`${contentContainerClasses} bg-blue-100`}>
                    <h2>Test Cases View</h2>
                </div>
            );

        case Operation.NoOp:
            return (
                <div className={`${contentContainerClasses} bg-blue-100`}>
                    <h2>Nothing</h2>
                </div>
            );
    }
};

function renderResult(results: TestResults) {
    return (
        results.status === "Pass" ? (
            <RenderPass pass={results}/>
        ) : results.status === "Fail" ? (
            RenderFail(results)
        ) : RenderURCodeErrorLOL(results)
    )
}

function RenderPass({ pass }: { pass: TestResultsPass }) {
    const [currentCase, setCurrentCase] = useState<number>(-1);
    const average_time = pass.info.Pass.average_time;
    console.log(average_time);

    const inputOutput = (title: "Input"|"Output"|"Expected", inputOutputClass: string) => { // NOTE: Added inputOutputClass as an argument
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-400 mb-4">
        {
            <p className="text-base px-3 py-1 font-semibold rounded-md bg-slate-700 text-red-500 shadow-md mb-3 w-fit">
                {title}
            </p>
        }
        {
            pass.info.Pass.Pass.map((testCase, index) => (
                (index === currentCase) ? (
                    // Code Block Styling (Using the passed-in class for flexibility)
                    <code 
                        key={index} 
                        className={inputOutputClass + " block p-4 rounded-lg bg-gray-800 text-white font-mono whitespace-pre-wrap"}
                    >
                    {
                        // Removed extra JSX braces around the content
                        title === "Input" ? testCase.input : title === "Output" ? testCase.got : testCase.expected
                    }
                    </code>
                ) : (
                    // Use a fragment or null instead of an empty div for cleaner DOM
                    <div key={index}></div>
                )
            ))
        }
        </div>
    )
    }

    return (
        <>
        {
                <>
                <div className="py-5 px-5 flex space-x-4 overflow-x-auto pb-1 mb-4">
                {<p className="text-2xl px-3 py-1 font-semibold rounded-full bg-green-100 text-green-800 shadow-sm mb-4 w-fit">Approved</p>}
                <p>Execution Time: {average_time}</p>
                </div>

                <div className="py-5 px-5 flex space-x-4 overflow-x-auto pb-1 mb-4">
                    {pass.info.Pass.Pass.map((_testCase, index) => (

                        <OperationButton 
                            key={index} 
                            name={`Test Case ${index + 1}`} 
                            onClickFn={() => setCurrentCase(index)} 
                            isCurOp={currentCase === index}
                        />
                    ))}
                </div>
                </>
        }

        {
            inputOutput("Input", "text-sm") 
        }

        {
            inputOutput("Output", "text-base border border-red-500")
        }

        {
            inputOutput("Expected", "text-sm")
        }

        </>
    )
}


function RenderFail(fail: TestResultsFail) {
    const inputOutput = (title: "Input"|"Output"|"Expected", inputOutputClass: string) => { // NOTE: Added inputOutputClass as an argument
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-400 mb-4">
        {
            <p className="text-base px-3 py-1 font-semibold rounded-md bg-slate-700 text-red-500 shadow-md mb-3 w-fit">
                {title}
            </p>
        }
        {
            <code 
                className={inputOutputClass + " block p-4 rounded-lg bg-gray-800 text-white font-mono whitespace-pre-wrap"}
            >
            {
                // Removed extra JSX braces around the content
                title === "Input" ? fail.info.Fail.input : title === "Output" ? fail.info.Fail.got : fail.info.Fail.ex
            }
            </code>
        }
        </div>
    )
    }

    return (
        <>
        {
                <>
                <div className="py-5 px-5 flex space-x-4 overflow-x-auto pb-1 mb-4">
                {<p className="text-2xl px-3 py-1 font-semibold rounded-full bg-red-100 text-red-800 shadow-sm mb-4 w-fit">Incorrect</p>}
                </div>
                </>
        }

        {
            inputOutput("Input", "text-sm") 
        }

        {
            inputOutput("Output", "text-base border border-red-500")
        }

        {
            inputOutput("Expected", "text-sm")
        }

        </>
    )
}

function RenderURCodeErrorLOL(error: TestResultsCodeError) {
    return (
        <>

        <>
        <div className="py-5 px-5 flex space-x-4 overflow-x-auto pb-1 mb-4">
        {<p className="text-2xl px-3 py-1 font-semibold rounded-full bg-red-100 text-red-800 shadow-sm mb-4 w-fit">Error</p>}
        </div>
        </>

        {
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-400 mb-4">
            {
                <code 
                    className={" block p-4 rounded-lg bg-gray-800 text-white font-mono whitespace-pre-wrap"}
                >
                {
                    error.info.URCodeErrorLOL.error
                }
                </code>
            }
            </div>
        }
        </>
    )
}

export default function TestOperations({currentOperations, setCurOp, data, triggerEvent}: TestOperationsProps) {
    useEffect(() => {
        if (currentOperations === Operation.ResultOp) {
          triggerEvent();
        }
      }, [currentOperations, triggerEvent]);

    return (
        <div className="h-full flex flex-col"> 
            {/* Navigation Section: flex-shrink-0 ensures this stays at the top */}
            <div className="py-5 px-5 flex space-x-4 overflow-x-auto flex-shrink-0 border-b dark:border-slate-800">
                <OperationButton name="results" onClickFn={() => setCurOp(Operation.ResultOp)} isCurOp={currentOperations === Operation.ResultOp}/>
                <OperationButton name="test cases" onClickFn={() => setCurOp(Operation.TestCasesOp)} isCurOp={currentOperations === Operation.TestCasesOp}/>
                <OperationButton name="solutions" onClickFn={() => setCurOp(Operation.SolutionsOp)} isCurOp={currentOperations === Operation.SolutionsOp}/>
                <OperationButton name="settings" onClickFn={() => setCurOp(Operation.SettingsOp)} isCurOp={currentOperations === Operation.SettingsOp}/>
                <OperationButton name="analysis" onClickFn={() => setCurOp(Operation.AnalysisOp)} isCurOp={currentOperations === Operation.AnalysisOp}/>
            </div>

            {/* Scrollable Content Section */}
            {/* min-h-0 is essential here to allow the div to shrink and trigger the scrollbar */}
            <div className="flex-grow overflow-y-auto min-h-0 px-5 py-5 scrollbar-gutter-stable">
                {renderContent(currentOperations, data)}
            </div>
        </div>
    )
}
