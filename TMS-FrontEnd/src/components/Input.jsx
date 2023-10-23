import React from 'react'

export default function Input(props) {
    
    const title = props.title
    
    return (
        <div className="relative z-0 w-full mb-6 group">
            <input {...props} className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 peer appearance-none   focus:outline-none focus:ring-0 `} placeholder=" "/>
            <label className={`text-gray-500 peer-focus:text-blue-600  peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8`}>{title}</label>
        </div>
    )
}