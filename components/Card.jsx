import React from 'react'

const Card = ({ title, description, icon: Icon }) => {
  return (
    <div className='group relative p-6 m-4 flex flex-col justify-between min-h-[320px] max-w-sm bg-black rounded-2xl shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 ease-out cursor-pointer overflow-hidden border-2 border-white hover:border-pink-500'>
      
      {/* Animated gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
      
      {/* Glowing orbs */}
      <div className='absolute -top-20 -right-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500'></div>
      <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500'></div>
      
      {/* Content container */}
      <div className='relative z-10 flex flex-col justify-between h-full'>
        
        {/* Card Content */}
        <div className='space-y-3 flex-grow'>
          <h1 className='text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 tracking-wide drop-shadow-lg'>
            {title}
          </h1>
          <p className='text-sm md:text-base text-gray-300 leading-relaxed'>
            {description}
          </p>
        </div>

        {/* Decorative Icon */}
        <div className='flex justify-end mt-6'>
          <div className='p-3 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl border border-white group-hover:border-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-pink-500/20'>
            {Icon ? (
              Icon
            ) : (
              <svg 
                className="w-8 h-8 text-pink-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card