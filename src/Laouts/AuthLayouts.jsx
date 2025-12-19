import React from 'react';
import Logo from '../Components/Logo/Logo';
import { Outlet } from 'react-router';

const AuthLayouts = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Logo></Logo>
            <div className=''>
                <div className=''>
                    <Outlet></Outlet>
                </div>
                
            </div>
        </div>
    );
};

export default AuthLayouts;