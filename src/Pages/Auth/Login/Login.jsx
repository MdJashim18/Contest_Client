import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { signInUser, signInGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        signInUser(data.email, data.password)
            .then(() => {
                navigate(location?.state || '/');
            })
            .catch(err => console.log(err));
    };

    const handleGoogleSignIn = () => {
        signInGoogle()
            .then(() => {
                navigate(location?.state || '/');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-2">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Login to your ContestHub account
                </p>

                {/* Login Form */}
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                        <label className="label font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="label font-medium">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* <div className="text-right">
                        <Link className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div> */}

                    <button className="btn btn-neutral w-full mt-2">
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="divider my-6">OR</div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleSignIn}
                    className="btn w-full bg-white text-black border hover:bg-gray-100 flex gap-2"
                >
                    <svg width="18" height="18" viewBox="0 0 512 512">
                        <path fill="#EA4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"/>
                        <path fill="#34A853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341z"/>
                        <path fill="#4285F4" d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57z"/>
                        <path fill="#FBBC02" d="M90 341a208 200 0 010-171l63 49q-12 37 0 73z"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Footer */}
                <p className="text-center mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
