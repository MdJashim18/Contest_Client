import React from 'react';
import Logo from '../../../Components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../Hooks/useAuth';

const Navbar = () => {
    const { user, LogOut } = useAuth()

    const handleLogOut = () => {
        LogOut()
            .then()
            .catch(error => {
                console.log(error)
            })
    }

    const links = (
        <>
            <li><NavLink to='/'>Home </NavLink></li>
            <li><NavLink to='/allFoods'>All Contests</NavLink></li>
            <li><NavLink to='/send-parcel'>Extra Section</NavLink></li>

            {
                user && <>
                    <li><NavLink to='/dashboard/my-parcels'>My Parcel</NavLink></li>
                </>
            }
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">
                    <Logo></Logo>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end pr-5">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src={user.photoURL || "https://via.placeholder.com/100"}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                        >
                            <li><NavLink to="/profile">displayName</NavLink></li>
                            <li><NavLink to="/addReview">Dashboard </NavLink></li>
                            <li><button onClick={handleLogOut}>Logout</button></li>
                        </ul>
                    </div>

                ) : (
                    <NavLink to="/login" className="btn">
                        Login
                    </NavLink>
                )}
            </div>

        </div>
    );
};

export default Navbar;