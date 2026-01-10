import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bannerImg1 from "../../../assets/b1.png";
import bannerImg2 from "../../../assets/b2.png";
import bannerImg3 from "../../../assets/b3.png";
import { useNavigate } from "react-router";

const Banner = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) {
            return;
        }

        navigate(`/contest?type=${search}`);
    };

    return (
        <div className="relative">
            <Carousel
                autoPlay
                infiniteLoop
                interval={4000}
                showThumbs={false}
                showStatus={false}
            >
                {[bannerImg1, bannerImg2, bannerImg3].map((img, i) => (
                    <div key={i} className="h-[70vh] md:h-[85vh] w-full">
                        <img
                            src={img}
                            className="object-container h-full w-full"
                            alt="banner"
                        />

                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
