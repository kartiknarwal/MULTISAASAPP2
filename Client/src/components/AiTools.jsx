import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      <div className="text-center">
        <h2 className="text-3xl md:text-[42px] font-semibold text-slate-900 dark:text-white">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology
        </p>
      </div>

      <div className="flex flex-wrap mt-10 justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            className="p-8 m-4 max-w-xs rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() =>
              user ? navigate(tool.path) : navigate('/sign-in')
            }
          >
           {tool.Icon && (
  <tool.Icon
    className="w-12 h-12 p-3 rounded-full"
    style={{
      background: `linear-gradient(135deg, ${tool.bgFrom}, ${tool.bgTo})`,
      color: 'white',
    }}
  />
)}

            <h3 className="mt-6 mb-3 text-lg font-semibold text-slate-800 dark:text-white">
              {tool.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[95%]">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AiTools
