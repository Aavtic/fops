import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


type EditorProps = {
    title: string,
    description: string,
    codeTemplate: string,
}

{/* <div className="flex"> */}
{/* <LeftComponent title={title} description={description}/> */}
{/* <RightComponent /> */}
{/* </div> */}

export default function EditorPage({title, description, codeTemplate}: EditorProps) {
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
                <LeftComponent title={title} description={description} />
              </div>
            </ResizablePanel>
            <ResizableHandle className="flex-1 bg-black h-1.5" withHandle />
            <ResizablePanel defaultSize={35} minSize={20}>
              <div className={border_style}>
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        {/* Handle between LEFT + RIGHT */}
        <ResizableHandle className="bg-black w-1.5" withHandle />

        {/* RIGHT SIDE */}
        <ResizablePanel>
          <div className={border_style}>
            <RightComponent codeTemplate={codeTemplate} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    )
}
