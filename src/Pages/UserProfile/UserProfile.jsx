import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import axios from 'axios';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useParams } from 'react-router';

const COLORS = ['#22c55e', '#ef4444'];

const UserProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = UseAxiosSecure();
    const [profile, setProfile] = useState({});
    const [stats, setStats] = useState({ won: 0, participated: 0 });
    const [open, setOpen] = useState(false);
    const {_id} = useParams()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // ================= Load profile =================
    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/users/profile?email=${user.email}`).then(res => {
                setProfile(res.data);
                console.log(res.data)
            });

            axiosSecure.get(`/contest-stats?email=${user.email}`).then(res => {
                setStats(res.data); // { won: number, participated: number }
            });
        }
    }, [user, axiosSecure]);

    // ================= Update profile =================
    const handleUpdate = async (data) => {
        try {
            if (!user?.email) {
                console.log(user.email)
                alert("User email missing");
                return;
            }

            let photoURL = profile.photoURL;

            if (data.photo?.length > 0) {
                const formData = new FormData();
                formData.append('image', data.photo[0]);

                const imgUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
                const imgRes = await axios.post(imgUrl, formData);
                photoURL = imgRes.data.data.url;
            }

            await updateUserProfile({
                displayName: data.name,
                photoURL:data.photoURL
            });

            
            const updatedInfo = {
                email: user.email,  // ADD THIS
                name: data.name,
                photoURL:data.photoURL,
                address: data.address,
            };

            const res = await axiosSecure.patch(`/users/profile/${_id}`,updatedInfo);
            console.log("DB update result:", res.data);

            setProfile(prev => ({ ...prev, ...updatedInfo }));
            reset();
            setOpen(false);

        } catch (error) {
            console.error("❌ Update failed:", error.response?.data || error.message);
            alert("Profile update failed");
        }
    };


    // ================= Pie chart data =================
    const pieData = [
        { name: 'Won', value: stats.won },
        {
            name: 'Lost',
            value: Math.max(stats.participated - stats.won, 0),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">

            {/* ================= Profile Card ================= */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
                <img
                    src={profile.photoURL || user?.photoURL}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border"
                />

                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{profile.name || user?.displayName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="mt-2">
                        <span className="font-medium">Address:</span>{' '}
                        {profile.address || 'Not added'}
                    </p>

                    <button
                        onClick={() => setOpen(true)}
                        className="btn btn-primary btn-sm mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* ================= Update Modal ================= */}
            {open && (
                <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

                    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                        <div>
                            <label className="label">Name</label>
                            <input
                                defaultValue={profile.name}
                                {...register('name', { required: true })}
                                className="input input-bordered w-full"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">Name is required</span>
                            )}
                        </div>

                        <div>
                            <label className="label">Address</label>
                            <input
                                defaultValue={profile.address}
                                {...register('address', { required: true })}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div>
                            <label className="label">Profile Photo</label>
                            <input
                                type="file"
                                {...register('photo')}
                                className="file-input file-input-bordered w-full"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button className="btn btn-success">Save</button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ================= Win Percentage Chart ================= */}
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Contest Performance
                </h3>

                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                label
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <p className="text-center mt-4">
                    Won <b>{stats.won}</b> out of <b>{stats.participated}</b> contests
                </p>
            </div>
        </div>
    );
};

export default UserProfile;
