import React from 'react'

const Card = ({ title, description, icon: Icon }) => {
  return (
    <div className='
      p-4 m-15 
      flex-col justify-between items-center
      bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 
      rounded-2xl 
      shadow-lg 
      transform hover:scale-105 hover:shadow-2xl 
      transition-all duration-100 ease-in-out
      cursor-pointer
    '>
      {/* Card Content */}
      <div>
        <h1 className='text-3xl font-bold text-white tracking-wide'>
          {title}
        </h1>
        <p className='mt-2 text-lg text-gray-200'>
          {description}
        </p>
      </div>

      {/* Decorative Icon */}
      <div className='self-end'>
        {Icon ? (
          Icon
        ) : (
          <svg 
            className="w-10 h-10 text-white/50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M18.364 18.364A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default Card