import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer/Footer';
import Navbar from '../Pages/Shared/Navbar/Navbar';

const RootLayouts = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <div className='sticky top-0 z-50'>
                <Navbar></Navbar>
            </div>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayouts;