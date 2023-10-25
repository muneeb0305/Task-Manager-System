import React, { useEffect } from 'react'
import { AdminCardData } from '../../data/DashboardCardData'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid'
import Card from '../../components/Card'
import Table from '../../components/Table'
import { useProjectData } from '../../context/ProjectProvider'
import { useUserData } from '../../context/UserProvider'
import { useTeamData } from '../../context/TeamProvider'

export default function Dashboard() {
  //Get Data from Providers
  const { project, getProject, remove } = useProjectData()
  const { user, getUser } = useUserData()
  const { team, getTeam } = useTeamData()

  useEffect(() => {
    getProject()
    getUser()
    getTeam()
    // eslint-disable-next-line
  }, []);

  //table Configuration
  const tableConfig = {
    tableHeader: ["Project Name", "Assigned to"],
    tableData: project,
    removeFunc: remove,
    dataArr: ['projectName', 'assignedTo'],
  }

  return (
    <section>
      <div className={'bg-gray-100 min-h-screen pb-4 pt-20'}>
        <div className='container mx-auto px-5 pt-5'>
          <h1 className='text-4xl font-semibold mb-5'>Dashboard</h1>
          {/* Dashboard Cards */}
          <div className='grid gap-6 mb-5 md:grid-cols-3'>
            {
              AdminCardData.map(({ title, icon }) => {
                if (title === 'Teams') {
                  return (<Card
                    key={title}
                    textColor={'text-blue-500'}
                    bgColor={'bg-blue-100'}
                    icon={icon}
                    title={title}
                    value={team.length}
                  />)
                }
                else if (title === 'Projects') {
                  return (<Card
                    key={title}
                    textColor={'text-orange-500'}
                    bgColor={'bg-orange-100'}
                    icon={icon}
                    title={title}
                    value={project.length}
                  />)
                }
                return (<Card
                  key={title}
                  textColor={'text-green-500'}
                  bgColor={'bg-green-100'}
                  icon={icon}
                  title={title}
                  value={user.length}
                />)
              })
            }
          </div>
          {/* Project Table */}
          <div className={`bg-white border-2 rounded-lg  shadow-lg p-5`}>
            <div className='flex items-center'>
              <ClipboardDocumentCheckIcon className={`h-7 w-7 text-blue-500 `} />
              <h2 className='text-xl pl-3'>On Going Projects</h2>
            </div>
            <Table {...tableConfig} />
          </div>
        </div>
      </div>
    </section>

  )
}