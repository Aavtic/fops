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


    const border_style = "m-2 p-2 rounded-xl border-2 border-cyan-800 overflow-hidden";
    return (
    <div className="">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-screen h-screen"
      >
        {/* LEFT SIDE: vertical stack */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <div className={border_style + " "}>
                <LeftComponent title={title} description_html={description_html} />
              </div>
            </ResizablePanel>
            <ResizableHandle className="flex-1 bg-black h-1.5" withHandle />
            <ResizablePanel ref={panelRef} defaultSize={35} minSize={20}>
              {/* Add h-full and flex flex-col to this wrapper */}
              <div className={`${border_style} h-full flex flex-col`}>
                <TestOperations 
                    currentOperations={op == undefined ? Operation.NoOp : op} 
                    setCurOp={setOp}
                    data={dataState}
                    triggerEvent={handleTriggerEvent}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        {/* Handle between LEFT + RIGHT */}
        <ResizableHandle className="bg-black w-1.5" withHandle />

        {/* RIGHT SIDE */}
        <ResizablePanel>
          <div className={border_style}>
            <RightComponent 
                problem_id={problem_id}
                codeTemplate={code === undefined ? ("LOL THIS IS NOT THERE") : code}
                setTestData={setResults}
                testFn={TestCodeAPI}
                runFn={() => console.log("UNIMPLEMENTED")}
                // finallyFn = {}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    )
}
