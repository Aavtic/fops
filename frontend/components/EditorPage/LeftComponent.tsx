export default function LeftComponent({title, description_html}: {title: string, description_html: string}) {
    return (
        <div className="h-screen p-5 mb-4">
            {/* <h1 className="text-slate-800 text-4xl mb-8">{title}</h1> */}
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">{title}</h1>
                <div 
                className="prose prose-gray dark:prose-invert" dangerouslySetInnerHTML={{ __html: description_html}} />
        </div>
    )
}

