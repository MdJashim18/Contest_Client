
import React from 'react';
import { Link } from 'react-router';
import EImg from '../../assets/error-404.png'

const Error = () => {
    return (
        <div className='w-6/12 mx-auto'>
            <img className='w-full' src={EImg} alt="" />

            <div className='flex justify-center items-center m-5'>
                <Link to="/" className='btn bg-gradient-to-r from-[#632EE3] to-[#9F62F2] text-white text-center'>Back to Home</Link>
            </div>
        </div>
        
    );
};

export default Error;
