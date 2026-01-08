"use client"

import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";
import TestOperations from "./TestOperations"
import { Operation, DataState } from "./TestOperations"
import { TestResults } from "./TestOperations"
import { TestCodeAPI } from  './services'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

import { useState, useEffect } from 'react'


type EditorProps = {
    problem_id: string,
    title: string,
    description_html: string,
    codeTemplate: string,
}

{/* <div className="flex"> */}
{/* <LeftComponent title={title} description={description}/> */}
{/* <RightComponent /> */}
{/* </div> */}

export default function EditorPage({problem_id, title, description_html, codeTemplate}: EditorProps) {
    const [result, setResults] = useState<TestResults>();
    const [dataState, setDataState] = useState<DataState>();
    const [code, setCode] = useState<string>(codeTemplate);
    const [op, setOp] = useState<Operation>();

    useEffect(() => {
        setCode(codeTemplate);
        setOp(Operation.NoOp);
    }, [])

    useEffect(() => {
        if (result === undefined) return;
        setDataState({ResultData: result})
        setOp(Operation.ResultOp);
    }, [result])

    const panelRef = useRef<ImperativePanelHandle>(null);
    const handleTriggerEvent = () => {
        console.log("Here now");
      if (panelRef.current) {
        panelRef.current.resize(85); 
      }
    };

  const panel_wrapper = "h-full w-full bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col";
  
  // Style for the vertical handle (Horizontal separator)
  const vertical_handle = "flex w-[6px] items-center justify-center bg-gray-200 dark:bg-zinc-800 hover:bg-blue-500/50 transition-colors cursor-col-resize";
  
  // Style for the horizontal handle (Vertical separator)
  const horizontal_handle = "flex h-[6px] items-center justify-center bg-gray-200 dark:bg-zinc-800 hover:bg-blue-500/50 transition-colors cursor-row-resize";

  // The small "pill" bar inside the handle
  const grip_bar_vertical = "w-[2px] h-8 bg-gray-400 dark:bg-zinc-600 rounded-full";
  const grip_bar_horizontal = "h-[2px] w-8 bg-gray-400 dark:bg-zinc-600 rounded-full";

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-[#020202] text-slate-900 dark:text-slate-200 overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
      >
        {/* LEFT SIDE: Problem & Tests */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            
            {/* Top Left: Problem Description */}
            <ResizablePanel defaultSize={60} minSize={20}>
              <div className={`${panel_wrapper} border-b border-gray-200 dark:border-white/5`}>
                <div className="flex items-center h-10 px-4 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </div>
                <div className="flex-1 overflow-hidden">
                  <LeftComponent title={title} description_html={description_html} />
                </div>
              </div>
            </ResizablePanel>

            {/* Visible Horizontal Handle with Grip Bar */}
            <ResizableHandle className={horizontal_handle}>
                <div className={grip_bar_horizontal}></div>
            </ResizableHandle>

            {/* Bottom Left: Test Console */}
            <ResizablePanel ref={panelRef} defaultSize={40} minSize={10}>
              <div className={panel_wrapper}>
                <div className="flex items-center h-10 px-4 bg-gray-50 dark:bg-red-900/50 border-b border-gray-200 dark:border-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Test Console
                </div>
                <div className="flex-1 overflow-hidden">
                  <TestOperations 
                    currentOperations={op === undefined ? Operation.NoOp : op} 
                    setCurOp={setOp}
                    data={dataState}
                    triggerEvent={handleTriggerEvent}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        {/* Visible Vertical Divider with Grip Bar */}
        <ResizableHandle className={vertical_handle}>
            <div className={grip_bar_vertical}></div>
        </ResizableHandle>

        {/* RIGHT SIDE: Code Editor */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className={panel_wrapper}>
            <div className="flex items-center justify-between h-10 px-4 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-white/5">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Solution</span>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>
            <div className="flex-1">
              <RightComponent 
                problem_id={problem_id}
                codeTemplate={code === undefined ? "/* Code template missing */" : code}
                setTestData={setResults}
                testFn={TestCodeAPI}
                runFn={() => console.log("RUNNING...")}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
