"use client";

import { useState } from "react"
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


import { TestResults } from "./TestOperations"

const baseClasses = "py-2.5 px-6 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:shadow-lg focus:shadow-xl transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

function RunButton({onClickFn}: {onClickFn: () => any}) {
    return (
        <Button onClick={onClickFn} variant="outline" 
        className={baseClasses}>
        Run</Button>
    )
}

function TestCodeButton({ onClickFn } : { onClickFn: () => any }) {
    return (
        <Button onClick={onClickFn}variant="outline" 
        className={baseClasses}>
        Test Code</Button>
    )
}

function CodeEditor(
    { 
        setContent, code }: {
        setContent: (value: string) => void,
        code: string,
    })

{
    return (
        <div className="grid w-full gap-3">
          <Label htmlFor="code-editor"></Label>
          <CodeMirror
            value={code}
            height="288px"
            extensions={[python()]}
            theme={oneDark}
            onChange={(value) => setContent(value)}
            className="text-left"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              highlightSelectionMatches: true,
            }}
          />
        </div>
    )
}

interface RightComponentProps {
    problem_id: string,
    codeTemplate: string,
    setTestData: React.Dispatch<React.SetStateAction<TestResults|undefined>>;
    runFn: () => any,
    testFn: (code: string, problem_id: string) => any; 
}

export default function RightComponent({problem_id, codeTemplate, setTestData, testFn, runFn}: RightComponentProps) {
    const [codeContent, setCodeContent] = useState(codeTemplate);

    return (
    <div className="h-screen bg-white">
        <h1 className="italic text-4xl">Editor</h1>
        
        <CodeEditor code={codeContent} setContent={setCodeContent} />

        <div>
        <RunButton onClickFn={runFn} />
        <TestCodeButton onClickFn={async () => {
                const result = await testFn(codeContent, problem_id)
                setTestData(result);
            }
        } />
        </div>
    </div>
    )
}
