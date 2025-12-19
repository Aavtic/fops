export default function LeftComponent({ title, description_html }: { title: string, description_html: string }) {
    return (
        <div className="h-screen p-5 mb-4 flex flex-col">
            {/* Title Section (Fixed at the top) */}
            <h1 className="mb-4 flex-shrink-0 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
                {title}
            </h1>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: description_html }}
                />
            </div>
        </div>
    )
}

