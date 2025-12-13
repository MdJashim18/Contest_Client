import React from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const SendParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();
    const serviceCenters = useLoaderData();

    /* ---------------- Regions & Districts ---------------- */
    const regions = [...new Set(serviceCenters.map(c => c.region))];

    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');

    const districtByRegions = (region) => {
        if (!region) return [];
        return serviceCenters
            .filter(c => c.region === region)
            .map(d => d.district);
    };

    /* ---------------- Submit Handler ---------------- */
    const handleSendParcel = (data) => {
        const isDocument = data.parcelType === 'document';
        const isSameDistricts = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight);

        let cost = 0;

        if (isDocument) {
            cost = isSameDistricts ? 60 : 80;
        } else {
            if (parcelWeight < 3) {
                cost = isSameDistricts ? 110 : 150;
            } else {
                const base = isSameDistricts ? 110 : 150;
                const extraKg = parcelWeight - 3;
                const extraCharge = extraKg * 40;
                cost = base + extraCharge;
            }
        }

        const parcelData = {
            ...data,
            cost,
            status: 'pending',
            createdAt: new Date(),
        };

        data.cost = cost

        Swal.fire({
            title: "Confirm Parcel?",
            text: `Delivery Cost: ৳${cost}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Send it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.post('/parcels', parcelData)
                    .then(res => {
                        if (res.data.insertedId) {
                            Swal.fire("Success!", "Parcel has been sent.", "success");
                        }
                    });
            }
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Send Parcel</h2>

            <form onSubmit={handleSubmit(handleSendParcel)} className="p-4 space-y-6 text-black">

                {/* Parcel Type */}
                <div className="flex gap-6">
                    <label>
                        <input type="radio" value="document" {...register('parcelType')} defaultChecked /> Document
                    </label>
                    <label>
                        <input type="radio" value="non-document" {...register('parcelType')} /> Non-Document
                    </label>
                </div>

                {/* Parcel Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <input {...register('parcelName', { required: true })} placeholder="Parcel Name" className="input w-full" />
                    <input type="number" step="0.1" {...register('parcelWeight', { required: true })} placeholder="Weight (kg)" className="input w-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-10">

                    {/* Sender */}
                    <fieldset>
                        <h4 className="text-xl font-bold mb-2">Sender Details</h4>

                        <input {...register('senderName')} defaultValue={user?.displayName} className="input w-full mb-2" placeholder="Sender Name" />
                        <input {...register('senderEmail')} defaultValue={user?.email} className="input w-full mb-2" placeholder="Sender Email" />
                        <input {...register('senderAddress')} className="input w-full mb-2" placeholder="Sender Address" />

                        <select {...register('senderRegion')} defaultValue="" className="select w-full mb-2">
                            <option value="" disabled>Select Region</option>
                            {regions.map((r, i) => <option key={i}>{r}</option>)}
                        </select>

                        <select {...register('senderDistrict')} className="select w-full">
                            <option value="" disabled>Select District</option>
                            {districtByRegions(senderRegion).map((d, i) => <option key={i}>{d}</option>)}
                        </select>
                    </fieldset>

                    {/* Receiver */}
                    <fieldset>
                        <h4 className="text-xl font-bold mb-2">Receiver Details</h4>

                        <input {...register('receiverName')} className="input w-full mb-2" placeholder="Receiver Name" />
                        <input {...register('receiverEmail')} className="input w-full mb-2" placeholder="Receiver Email" />
                        <input {...register('receiverAddress')} className="input w-full mb-2" placeholder="Receiver Address" />

                        <select {...register('receiverRegion')} defaultValue="" className="select w-full mb-2">
                            <option value="" disabled>Select Region</option>
                            {regions.map((r, i) => <option key={i}>{r}</option>)}
                        </select>

                        <select {...register('receiverDistrict')} className="select w-full">
                            <option value="" disabled>Select District</option>
                            {districtByRegions(receiverRegion).map((d, i) => <option key={i}>{d}</option>)}
                        </select>
                    </fieldset>

                </div>

                <button className="btn btn-primary w-full mt-6">Send Parcel</button>
            </form>
        </div>
    );
};

export default SendParcel;
