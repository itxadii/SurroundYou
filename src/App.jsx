import React from 'react'
import Navbar from '../components/Navbar'
import Upload from '../components/Upload'
import Card from '../components/Card'
import Footer from '../components/Footer'
import headphonesImg from './assets/headphones.JPG'

const App = () => {
  return (
    <div>
      <div
       className='fixed inset-0 z-[-1] opacity-15 bg-center bg-cover bg-no-repeat' // Changed z-0 to z-[-1]
        style={{
        backgroundImage: `url(${headphonesImg})`,
        filter: 'blur(2px)'
      }}
      ></div>
      <Navbar />
      <Upload />
      <div className='flex flex-col md:flex-row justify-center items-center mt-20'>
        <Card 
          title="Free Spatial Audio Converter"
          description="Transform your favorite songs into immersive 8D audio with our free converter tool. Simply upload any audio file and experience it in stunning spatial dimensions. Download and enjoy your converted tracks anywhere, no technical expertise required."
        />

        <Card 
          title="Immersive 3D Soundscapes"
          description="Unlock a completely new listening dimension by combining our advanced audio processing and reverb enhancement. Feel the illusion of movement and depth as sound surrounds you from every angle. Whether enjoying music or audiobooks, elevate your audio experience to extraordinary levels.
"
        />
        <Card 
          title="Headphones On, Reality Off"
          description="Fully immerse yourself in 8D spatial audio with quality headphones for the ultimate experience. Block out distractions and discover the incredible illusion of movement and three-dimensional sound positioning. Stay aware of your surroundings while getting completely lost in the music."
        />
      </div>
      <Footer />
    </div>
  )
}

export default App;