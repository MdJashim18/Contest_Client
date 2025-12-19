import React from 'react';
import Banner from '../Banner/Banner';
import PopularContests from '../PopularContests/PopularContests';
import WinnerSection from '../WinnerSection/WinnerSection';
import ExtraSection from '../../ExtraSection/ExtraSection';




const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularContests></PopularContests>
            <WinnerSection></WinnerSection>
            <ExtraSection></ExtraSection>
        </div>
    );
};

export default Home;