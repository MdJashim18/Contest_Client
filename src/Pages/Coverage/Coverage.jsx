import React, { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const position = [23.6850, 90.3563]
    const wareHouse = useLoaderData()
    const mapRef = useRef(null)
    console.log(wareHouse)
    const handleLocation = (e)=>{
        e.preventDefault()
        const location = e.target.location.value
        const districtLocation = wareHouse.find(c=>c.district.toLowerCase().includes(location.toLowerCase()))
        if(districtLocation){
            const coord = [districtLocation.latitude,districtLocation.longitude]
            console.log("District : ",coord)
            mapRef.current.flyTo(coord,10)
        }
    }
    return (
        <div>
            <h2 className='text-5xl'>We available in 64 districts </h2>
            <div>
                <form action="" onSubmit={handleLocation}>
                    <label className="input">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" className="grow" name='location' placeholder="Search" />
                        <kbd className="kbd kbd-sm">⌘</kbd>
                        <kbd className="kbd kbd-sm">K</kbd>
                    </label>
                </form>
            </div>
            <div className='border w-full h-[600px]'>
                <MapContainer center={position} zoom={8} scrollWheelZoom={false} className='h-[600px]' ref={mapRef}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    {
                        wareHouse.map((house, index) => <Marker key={index} position={[house.latitude, house.longitude]}>
                            <Popup>
                                <strong>{house.district}</strong>
                                Service Area : {house.covered_area.join(',')}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>


            </div>
        </div>
    );
};

export default Coverage;