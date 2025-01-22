import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center'>
            <img src={assets.header_img} alt='' className='w-36 h-36 rounded-full mb-6' />
            <h1>Hey Developer <img src={assets.hand_wave} alt='' className='w-8 aspect-squre' /></h1>
            <h2>Welcome to Auth Page</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus dolor
                pariatur voluptates numquam eaque. Cum fuga eaque, aliquid dicta tempora id eveniet
                nulla assumenda debitis rem est. Nostrum, excepturi explicabo?</p>
            <button>Get Started</button>

        </div>
    )
}

export default Header
