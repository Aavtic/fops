"use client";

import { useState } from "react"
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


function RunButton({onClickFn}: {onClickFn: () => any}) {
    return (
        <Button onClick={onClickFn} variant="outline" 
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        Run</Button>
    )
}

function TestCodeButton({ onClickFn } : { onClickFn: () => any }) {
    return (
        <Button onClick={onClickFn}variant="outline" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
              autocompletion: true,
              highlightSelectionMatches: true,
            }}
          />
        </div>
    )
}

export default function RightComponent({codeTemplate}: {codeTemplate: string}) {
    const [codeContent, setCodeContent] = useState(codeTemplate);

    const onClickFn = () => {
        console.log(codeContent);
    };

    return (
    <div className="h-screen bg-white">
        <h1 className="italic text-4xl">Editor</h1>
        
        <CodeEditor code={codeContent} setContent={setCodeContent} />

        <div>
        <RunButton onClickFn={onClickFn} />
        <TestCodeButton onClickFn={onClickFn} />
        </div>
    </div>
    )
}
