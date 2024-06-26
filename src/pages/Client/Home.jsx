import React, {useEffect} from 'react'

import { SeachHome, ImageHome, HomeService, 
HomeAbout, HomeInfoweb, ListCall,
  
HomeDoctor, 
HomeBooking,
Download,
HomeBlog} from '../../components/UI/Home'
import { useNavigate } from "react-router-dom"

import getUserData from '../../route/CheckRouters/token/Token'

const Home =  () => {
    var token = getUserData();
    //console.log(token.user.id)
    // const navigateTo = useNavigate();
    //  useEffect(async () =>{
    //   if(getUserData != null){
    //     fetchDoctor();
    //    }else{
    //      localStorage.setItem('currentPath', '');
    //      navigateTo(`/`); 
    //    }
    //  }, []);

    //  const fetchDoctor = async () => {
    //    const checkExitDoctor = await axios.get(`https://spring-api-w8iy.onrender.com/api/doctor/findbyuserid/${token.user.id}`);
    //    if(checkExitDoctor  == null){
    //      localStorage.setItem('currentPath', '');
    //      navigateTo(`/account`);
    //    }
    //  }
    
  return (
    <>
      <SeachHome />
      <ImageHome />
      <HomeService />
      <HomeAbout />
      <HomeInfoweb />
      <ListCall />
      <HomeDoctor />
      <HomeBlog />
      <Download />
      
    </>
  )
}

export default Home