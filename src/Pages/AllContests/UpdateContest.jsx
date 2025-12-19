import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const UpdateContest = () => {
    const { id } = useParams(); 
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    
    useEffect(() => {
        axiosSecure.get(`/contest/${id}`)
            .then(res => {
                setContest(res.data);
                reset(res.data); 
            })
            .catch(err => console.error(err));
    }, [id, axiosSecure, reset]);

    
    const onSubmit = async (data) => {
        try {
            const updatedContest = {
                name: data.name,
                image: data.image,
                description: data.description,
                price: parseFloat(data.price),
                prizeMoney: parseFloat(data.prizeMoney),
                taskInstruction: data.taskInstruction,
                contestType: data.contestType,
                deadline: data.deadline,
            };

            const res = await axiosSecure.patch(`/contest/${id}`, updatedContest);

            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Contest updated successfully', 'success');
                navigate('/dashboard/ShowContestTable'); 
            } else {
                Swal.fire('Info', 'No changes made', 'info');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to update contest', 'error');
        }
    };

    if (!contest) return <p className="text-center mt-10">Loading contest...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-2xl shadow-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">Update Contest</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

               
                <div>
                    <label className="label">Contest Name</label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.name && <span className="text-red-500">Name is required</span>}
                </div>

                <div>
                    <label className="label">Image URL</label>
                    <input
                        type="text"
                        {...register('image', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.image && <span className="text-red-500">Image URL is required</span>}
                </div>

              
                <div>
                    <label className="label">Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        className="textarea textarea-bordered w-full"
                    ></textarea>
                    {errors.description && <span className="text-red-500">Description is required</span>}
                </div>

                
                <div>
                    <label className="label">Price</label>
                    <input
                        type="number"
                        {...register('price', { required: true, min: 0 })}
                        className="input input-bordered w-full"
                    />
                    {errors.price && <span className="text-red-500">Price is required</span>}
                </div>

               
                <div>
                    <label className="label">Prize Money</label>
                    <input
                        type="number"
                        {...register('prizeMoney', { required: true, min: 0 })}
                        className="input input-bordered w-full"
                    />
                    {errors.prizeMoney && <span className="text-red-500">Prize Money is required</span>}
                </div>

               
                <div>
                    <label className="label">Task Instruction</label>
                    <textarea
                        {...register('taskInstruction', { required: true })}
                        className="textarea textarea-bordered w-full"
                    ></textarea>
                    {errors.taskInstruction && <span className="text-red-500">Task instruction required</span>}
                </div>

                
                <div>
                    <label className="label">Contest Type</label>
                    <select
                        {...register('contestType', { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Type</option>
                        <option value="Design">Design</option>
                        <option value="Programming">Programming</option>
                        <option value="Writing">Writing</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.contestType && <span className="text-red-500">Contest type required</span>}
                </div>

                <div>
                    <label className="label">Deadline</label>
                    <input
                        type="datetime-local"
                        {...register('deadline', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.deadline && <span className="text-red-500">Deadline is required</span>}
                </div>

                <button className="btn btn-primary w-full mt-4">Update Contest</button>
            </form>
        </div>
    );
};

export default UpdateContest;
