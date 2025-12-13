import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { registerUser, updateUserProfile } = useAuth();

    const handleRegister = (data) => {
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(() => {
                const formData = new FormData();
                formData.append('image', profileImg);

                const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;

                axios.post(imageApiUrl, formData)
                    .then(res => {
                        const photoURL = res.data.data.url

                        const userInfo = {
                            email: data.email,
                            displayName: data.name,
                            photoURL: photoURL,
                        }

                        axiosSecure.post('/users',userInfo)
                         .then(res=>{
                            if(res.data.insertedId){
                                console.log("User Created in the database")
                            }
                         })
                        const userProfile = {
                            displayName: data.name,
                            photoURL: photoURL,
                        };

                        updateUserProfile(userProfile)
                            .then(() => {
                                navigate(location?.state || '/');
                            })
                            .catch(err => console.log(err));
                    });
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Join ContestHub and start your journey
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="label font-medium">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                Name is required
                            </span>
                        )}
                    </div>

                    {/* Photo */}
                    <div>
                        <label className="label font-medium">Profile Photo</label>
                        <input
                            type="file"
                            {...register('photo', { required: true })}
                            className="file-input file-input-bordered w-full"
                        />
                        {errors.photo && (
                            <span className="text-red-500 text-sm">
                                Profile photo is required
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="label font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                Email is required
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="label font-medium">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
                            })}
                            className="input input-bordered w-full"
                            placeholder="Enter your password"
                        />
                        {errors.password?.type === 'required' && (
                            <span className="text-red-500 text-sm">
                                Password is required
                            </span>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <span className="text-red-500 text-sm">
                                Password must be at least 6 characters
                            </span>
                        )}
                        {errors.password?.type === 'pattern' && (
                            <span className="text-red-500 text-sm">
                                Must include uppercase, lowercase & number
                            </span>
                        )}
                    </div>

                    <button className="btn btn-neutral w-full mt-4">
                        Register
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
