import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import amazon from '../../../assets/brands/amazon.png'
import amazonV from '../../../assets/brands/amazon_vector.png'
import casio from '../../../assets/brands/casio.png'
import moonstar from '../../../assets/brands/moonstar.png'
import randstad from '../../../assets/brands/randstad.png'
import star from '../../../assets/brands/star.png'
import star1 from '../../../assets/brands/start_people.png'
import { Autoplay } from 'swiper/modules';

const brandsLogos = [amazon, amazonV, casio, moonstar, randstad, star, star1]

const Brands = () => {
    return (
        <Swiper
            spaceBetween={30}
            slidesPerView={4}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}

            modules={[Autoplay]}
        >
            {
                brandsLogos.map((logo, index) => <SwiperSlide key={index}><img src={logo} alt="" /> </SwiperSlide>)
            }

        </Swiper>
    );
};

export default Brands;
