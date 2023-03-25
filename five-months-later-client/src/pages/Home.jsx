import { Divider } from '@mui/material';
import React from 'react';
import Homemain from '../Components/Home/Homemain';
import { MyGlobalContext } from '../Context';

const Home = () => {
    const {setIsNavOpen} = MyGlobalContext();
  return (
    <div onClick={() => setIsNavOpen(false)} className="home-page-content">
        <Homemain />
        <Divider />
    </div>
  )
}

export default Home;