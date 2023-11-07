import React from "react";

export default function Card({ config, data }) {
    const keys = Object.keys(config)
    const values = Object.values(config)
    return (
        <div className='grid gap-6 mb-5 md:grid-cols-3'>
            {
                data.map(({ title, icon, textColor, bgColor }) => {
                    const keyIndex = keys.indexOf(title);
                    if (keyIndex !== -1) {
                        return (
                            <div className={`min-w-0 rounded-lg shadow-lg overflow-hidden bg-white border-b-4 border-blue-300 `}>
                                <div className="p-4 flex items-center">
                                    <div className={`p-3 rounded-full ${textColor} ${bgColor}  mr-4 `}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p className={`mb-2 text-sm font-bold text-gray-600 `}>
                                            {title}
                                        </p>
                                        <p className={`text-lg font-semibold text-gray-500`}>
                                            {values[keyIndex]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return null
                })
            }
        </div>
    );
}