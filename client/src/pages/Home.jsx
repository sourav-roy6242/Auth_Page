import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    // <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-c over bg-center'>
    <div  className='flex items-center justify-center min-h-screen bg-gradient-to-br
    from-blue-300 to-purple-400  '>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
