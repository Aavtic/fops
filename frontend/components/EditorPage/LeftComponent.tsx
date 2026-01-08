export default function LeftComponent({ title, description_html }: { title: string, description_html: string }) {
    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm">
            {/* Header Section */}
            <div className="px-6 py-6 flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h1>
            </div>

            {/* Scrollable Description Area */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                <div className="px-6 py-8">
                    <div
                        className="
                            prose prose-slate dark:prose-invert max-w-none
                            prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white
                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
                            prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                            prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1 prose-code:rounded
                            prose-li:text-gray-600 dark:prose-li:text-gray-400
                        "
                        dangerouslySetInnerHTML={{ __html: description_html }}
                    />
                    
                    {/* Constraints Footer Example */}
                    <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Discussion & Hints
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                            Think about edge cases like empty inputs or extremely large numbers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
