import React from 'react';
import Logo from '../Components/Logo/Logo';
import { NavLink, Outlet } from 'react-router';

const AuthLayouts = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <NavLink to="/" className="flex items-center space-x-3 group">

                <div className="hidden md:block">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ContestHub
                    </h1>
                </div>
            </NavLink>
            <div className=''>
                <div className=''>
                    <Outlet></Outlet>
                </div>

            </div>
        </div>
    );
};

export default AuthLayouts;