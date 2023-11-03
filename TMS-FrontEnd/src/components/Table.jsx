import React from 'react'
import Modal from './Modal'

export default function Table({ tableData, tableHeader, dataArr, editLink, viewLink, removeFunc }) {
  return (
    <section >
      <div className='w-full'>
        <div className="p-4">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`bg-blue-600 text-white text-center`}>
                    <tr className='text-center'>
                      {tableHeader.map((header, index) => (
                        <th key={index} className="text-sm font-medium px-6 py-4">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  {
                    tableData?.length ? (
                      <tbody>
                        {tableData.map((data, index) => (
                          <tr key={index} className={`hover:bg-gray-50 border-b text-center`}>
                            {
                              dataArr.map(key => (
                                <td key={key} className="font-medium px-6 py-4 whitespace-nowrap text-sm  text-gray-900">
                                  {
                                    data[key]
                                  }
                                </td>
                              ))
                            }
                            {
                              tableHeader.includes('Action') && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <Modal ID={data.id} editLink={editLink} viewLink={viewLink} remove={removeFunc} />
                                </td>
                              )}
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan={tableHeader.length} className="text-center text-sm text-gray-400 pt-4">No Data Found</td>
                        </tr>
                      </tbody>
                    )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

}