import React, { use } from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {

    const reviewsData = use(reviewsPromise)
    console.log(reviewsData)
    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            // spaceBetween={}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            coverflowEffect={{
                rotate: 30,
                stretch: '50%',
                depth: 200,
                scale:0.75,
                modifier: 1,
                slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination,Autoplay]}
            className="mySwiper"
        >

            {
                reviewsData.map(review => <SwiperSlide key={review.id}>
                    <ReviewCard review={review}  > </ReviewCard>
                </SwiperSlide>)
            }

        </Swiper>
    );
};

export default Reviews;