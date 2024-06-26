import React, { useState, useEffect } from 'react'
import axios from 'axios';
import bg_login from '../../public/images/image-login.png';
import { motion } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import queryString from 'query-string';
import * as ecryptToken from '../ultils/encrypt'

const LoginGmailStep = () => {
  const [username, setUsername] = useState('');
  const [keycode, setKeycode] = useState('');
  const navigateTo = useNavigate();
  const currentPath = localStorage.getItem('currentPath');
  useEffect(() => {
      const queryParams = queryString.parse(window.location.search);
      setUsername(queryParams.username);
      // Bây giờ bạn có thể làm gì đó với giá trị của username
    }, []);
  
  const handleSubmit = async (e) =>{
      e.preventDefault();

      // Chuyển hướng trở lại đường dẫn hiện tại sau khi đăng nhập thành công
      const data = {
          username: username,
          keycode: keycode,
          provider: ''
      }
      console.log(data);
      try {

          const result =  await axios.post('https://spring-api-w8iy.onrender.com/api/auth/login', data);
             
             console.log(result.data.user.roles[0]);

              if (result && result.data) {
                  localStorage.setItem('Token', ecryptToken.encryptToken(JSON.stringify(result.data)));
                  if(result.data.user.roles[0] === 'DOCTOR'){
                      localStorage.setItem('currentPath', '');
                      navigateTo(`/dashboard/doctor`);
                  }else if(result.data.user.roles[0] === 'ADMIN'){
                      localStorage.setItem('currentPath', '');
                      navigateTo(`/dashboard/admin`);
                  }else{
                      if(currentPath == null || currentPath == ''){
                          navigateTo('/');
                      }else{
                          localStorage.setItem('currentPath', '');
                          navigateTo(currentPath);
                      }
                  }
                  
              }
              window.location.reload();
      } catch (error) {
      }
  }
  

  return (
    <>
    <div className='container mt-5'>
        <div className="row">
            <div className="col-md-6">
                <div className="col-12">
                    <img src={bg_login} alt="" className='img-fluid' />
                </div>
            </div>
            <div className="col-md-1"></div>
            <div className='col-md-5'>
                <div className="col-12">
                    <div className="text-center justify-content-center px-5 mt-xxl-5">
                        <h3 className='login__title'>Login</h3>
                        <h5 className='login__title_sup'>Booking appointment</h5>
                        <div className='py-5 border-top border-dark border-2 mt-3'>
                            {/* <h5 className='mb-2 text-black-50'>Step 2: Xác thực sms đã send qua điện thoại</h5> */}
                            <form onClick={handleSubmit}>
                                <input type="hidden" name="provider" value="phone" />
                                <div className="mb-3">
                                    <input type="text" className="input__username"
                                     id="input__phone"
                                     placeholder="Enter keycode"
                                     value={keycode}
                                     onChange={(e) => setKeycode(e.target.value)}
                                     />
                                </div>
                                <div className="mb-4">
                                    <motion.div whileTap={{ scale: 0.8 }}>
                                        <button type='submit' className='btn__submit'>Submit</button>
                                    </motion.div>
                                </div>
                            </form>
                        </div>

                        <div className='mt-xl-5'>
                            <p>Quay về trang login. <Link to="/login" className='text-decoration-none ms-2'>Back to login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>
  )
}

export default LoginGmailStep