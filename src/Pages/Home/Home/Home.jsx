import React from 'react';
import Banner from '../Banner/Banner';
import PopularContests from '../PopularContests/PopularContests';
import WinnerSection from '../WinnerSection/WinnerSection';
import ExtraSection from '../../ExtraSection/ExtraSection';
import HomePart from '../HomePart/HomePart';




const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularContests></PopularContests>
            <WinnerSection></WinnerSection>
            <HomePart></HomePart>
            <ExtraSection></ExtraSection>
        </div>
    );
};

export default Home;