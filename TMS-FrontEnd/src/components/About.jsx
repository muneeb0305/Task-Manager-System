import React from 'react'

export default function About(props) {

    const dataArr = Object.entries(props.data).map(([key, value]) => ({
        key: key,
        value: value,
    }));

    return (
        <div className="bg-white p-5 shadow-lg rounded-sm border-2">
            <div className="flex items-center space-x-2 font-semibold text-gray-900  mb-3">
                <span className="text-blue-500">
                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                </span>
                <span className="tracking-wide">About</span>
            </div>
            <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                    {
                        dataArr.map((data, index) => (
                            <div key={index} className="grid grid-cols-2">
                                <div className="px-4 py-2 font-semibold">{data.key}</div>
                                <div className="px-4 py-2">{data.value}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
