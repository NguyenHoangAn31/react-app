import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import bg_login from '../../public/images/image-login.png';
import { motion } from 'framer-motion';
import { auth } from "../services/auth/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-hot-toast";
import axios from 'axios';

const LoginPhone = () => {
    const navigateTo = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const provider = 'phone';

    // Initialize recaptchaVerifier as a state
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

    // Function to initialize reCAPTCHA
    const initRecaptcha = () => {
        if (!recaptchaVerifier) {
            setRecaptchaVerifier(new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: () => {
                    console.log('reCAPTCHA resolved..');
                    handleSendOtp(); // Trigger OTP sending after reCAPTCHA resolves
                }
            }));
        }
    };

    useEffect(() => {
        initRecaptcha(); // Initialize reCAPTCHA on component mount
    }, []); // Empty dependency array ensures this runs once

    const handleSendOtp = async (event) => {
        event.preventDefault();
        const data = {
            username: username,
            provider: provider
        };

        try {
            const result = await axios.post('http://localhost:8080/api/auth/check-account', data);
            console.log(result.data.result);
            if (result.data.result === 'true') {
                console.log('Bắt đầu gửi mã OTP');
                const appVerifier = recaptchaVerifier;
                const formatPh = "+84" + username.slice(1);

                signInWithPhoneNumber(auth, formatPh, appVerifier)
                    .then((confirmationResult) => {
                        console.log('OTP confirmation result:', confirmationResult);
                        window.confirmationResult = confirmationResult;
                        setLoading(false);
                        toast.success("OTP sent successfully!", {
                            position: "top-right"
                        });
                        navigateTo(`/login-by-phone-submit?username=${data.username}`);
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log('Error sending OTP:', error);
                        toast.error("Error sending OTP. Please try again.", {
                            position: "top-right"
                        });
                    });
            } else if (result.data.result === 'disable') {
                alert("Your account has been disabled. Please contact the administrator for processing");
                console.log('this account has been disabled');
            } else {
                toast.error("User not found or please try again with Gmail!", {
                    position: "bottom-right"
                });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error("Error sending OTP. Please try again later.", {
                position: "bottom-right"
            });
        }
    };

    return (
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
                                <div id="recaptcha-container"></div>
                                <form onSubmit={handleSendOtp}>
                                    <div className="mb-3">
                                        <input
                                            className="input__username"
                                            id="input__phone"
                                            placeholder="Enter your phone: +84123456789"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <motion.div whileTap={{ scale: 0.8 }}>
                                            <button type='submit' className='btn__submit'>Login</button>
                                        </motion.div>
                                    </div>
                                </form>
                            </div>
                            <div className='mt-xl-5'>
                                <p>Quay về trang login. <a href="/login" className='text-decoration-none ms-2'>Back to login</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPhone;
