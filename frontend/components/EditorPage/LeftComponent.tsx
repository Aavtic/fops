export default function LeftComponent({title, description}: {title: string, description: string}) {
    return (
        <div className="h-screen bg-gray-500 p-5 mb-8">
            <h1 className="text-slate-800 text-4xl mb-8">{title}</h1>
            <p className="text-gray-800">
            {description}
            </p>
        </div>
    )
}

