export const LoadingSkeleton = () => {
    return (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
            <div className="flex flex-row border-b-8 border-b-gray-100 p-4"></div>
            <div className="grid gap-2 p-4">
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 g-4 p-4">
                        <div className="flex flex-row pb-2">
                            <div className="flex flex-grow flex-col">
                                <div className="bg-gray-200 rounded h-6 w-3/4 mb-2"></div>
                                <div className="bg-gray-200 rounded h-4 w-1/2 mb-1"></div>
                                <div className="bg-gray-200 rounded h-4 w-1/4"></div>
                            </div>
                            <div></div>
                        </div>
                        <div className="grid gap-2 pl-2">
                            <div className="flex items-center">
                                <span className="bg-gray-200 rounded-full h-6 w-6 inline-block"></span>
                                <span className="ml-2 bg-gray-200 rounded h-4 w-1/4"></span>
                            </div>
                        </div>
                        <div className="pb-4 pt-2">
                            <span className="bg-gray-200 rounded h-4 w-1/3"></span>
                        </div>
                        <div className="grid place-items-center rounded-lg border border-black-500 py-2">
                            <span className="bg-gray-200 rounded h-4 w-1/2"></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};