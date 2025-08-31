"use client";

import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

function TextArea(
    { 
        setContent, code }: {
        setContent: (value: string) => void,
        code: string,
    })

{
    return (
        <div className="grid w-full gap-3">
          <Label htmlFor="message-2"></Label>
          <Textarea value={ code }onChange={(e) => setContent(e.target.value)}placeholder="Write your code here..." id="message-2" 
          className="h-72 bg-gray-400"/>
        </div>
    )
}

export default function RightComponent() {

    const [codeContent, setCodeContent] = useState('');

    const onClickFn = () => {
        console.log(codeContent);
    };

    return (
    <div className="h-screen bg-gray-500">
        <h1 className="text-4xl">Editor</h1>
        
        <TextArea code={codeContent} setContent={setCodeContent} />

        <div>
        <RunButton onClickFn={onClickFn} />
        <TestCodeButton onClickFn={onClickFn} />
        </div>
    </div>
    )
}
