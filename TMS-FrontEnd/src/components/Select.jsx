import React from 'react'

export default function Select(props) {

    return (
        <div className="relative z-0 w-full mb-6 group">
            <label className={`'text-gray-500 pr-5`}>Select {props.label}</label>
            <select className={`w-52 focus:ring-blue-500 focus:border-blue-500 bg-white border border-gray-300 rounded-md shadow-sm py-2 text-center text-gray-700 leading-tight focus:outline-none focus:ring-2 `} {...props} required>
                {
                    props.data.map((data, index) => (
                        <option key={index} value={data.id}>{data.value}</option>
                    ))
                }
            </select>
        </div>
    )
}