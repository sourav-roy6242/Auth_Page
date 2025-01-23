import React from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const Header = () => {
const {userData} = useContext(AppContext)

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center'>
            <img src={assets.header_img} alt='' className='w-36 h-36 rounded-full mb-6' />
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name :  'Developer'}! <img src={assets.hand_wave} alt='' className='w-8 aspect-squre' /></h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Auth Page</h2>
            <p className='mb-6 max-w-2xl' >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus dolor
                pariatur voluptates numquam eaque. Cum fuga eaque, aliquid dicta tempora id eveniet
                nulla assumenda debitis rem est. Nostrum, excepturi explicabo?</p>
            <button className='border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-200 transition-all'>Get Started</button>

        </div>
    )
}

export default Header
