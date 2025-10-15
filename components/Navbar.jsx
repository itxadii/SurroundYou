import React from 'react'
import logo from '../src/assets/logo.png'
import backgroundImage from '../src/assets/1500x500.jpeg'

const Navbar = () => {
    return (
        <>
        <div className='h-30 w-full font-bold flex justify-between items-center p-4' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <img src={logo} alt="logo" className='w-60 h-23 rounded-l-full' />
            <a
            href="https://www.buymeacoffee.com/ifeelhonney"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFDD00] text-black font-bold border-3 border-black rounded-md px-4 py-2 m-2 hover:bg-[#f9d300] transition-all duration-100 shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform hover:scale-101 hover:shadow-2xl ease-in-out"
            >
            <img
                src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                alt="coffee"
                className="w-5 h-5 text-amber-50"
            />
            <span className="font-mono hidden md:inline">Buy me a coffee</span>
            </a>
        </div>
        </>
    )
}

export default Navbar;