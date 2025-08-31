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
}

{/* <div className="flex"> */}
{/* <LeftComponent title={title} description={description}/> */}
{/* <RightComponent /> */}
{/* </div> */}

export default function EditorPage({title, description}: EditorProps) {
    return (
        <ResizablePanelGroup
          direction="horizontal"
          className="w-screen h-screen rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
          <LeftComponent title={title} description={description} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
              <RightComponent />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Three</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
    )
}
