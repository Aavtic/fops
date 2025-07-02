import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";

type EditorProps = {
    title: string,
    description: string,
}

export default function EditorPage({title, description}: EditorProps) {
    return (
        <div className="flex">
        <LeftComponent title={title} description={description}/>
        <RightComponent />
        </div>
    )
}
