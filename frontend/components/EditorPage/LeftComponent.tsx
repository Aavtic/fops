export default function LeftComponent({title, description}: {title: string, description: string}) {
    return (
        <div className="h-screen p-5 mb-4">
            {/* <h1 className="text-slate-800 text-4xl mb-8">{title}</h1> */}
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">{title}</h1>
            <p className="mb-3 text-gray-800 dark:text-gray-800">
            {description}
            </p>
        </div>
    )
}

