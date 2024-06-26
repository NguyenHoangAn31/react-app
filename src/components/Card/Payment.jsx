import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { format } from 'date-fns';
import { addAppointment } from '../../services/API/bookingService';
import axios from 'axios';
import { formatDate } from '../../ultils/formatDate';
import { Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const Payment = ({ setActiveHourIndex, setSlotName, setSchedules, isOpen, data, onClose }) => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [countdown, setCountdown] = useState(7); // Initialize countdown timer to 10 seconds
    const [isDisabled, setIsDisabled] = useState(false);

    const [note, setNote] = useState('')
    const handleChangeContent = (value) => {
        setNote(value)
    }

    console.log(data);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000); // Decrement countdown every second
            return () => clearTimeout(timer); // Clear timeout if component unmounts or countdown changes
        } else {
            setIsDisabled(false); // Enable button when countdown reaches 0
        }
    }, [countdown]);

    const handlePaymentChange = async (method) => {
        setIsDisabled(true); // Disable button when countdown reaches 0
        setPaymentMethod(method);
        if (method === 'vnpay') {
            try {
                const response = await axios.get('https://spring-api-w8iy.onrender.com/api/payment/create_payment_url', {
                    params: {
                        amount: data?.price * 0.3, // Số tiền cần thanh toán
                        orderType: 'billpayment',
                        returnUrl: 'http://localhost:5173/process-payment',
                    },
                });
                setPaymentUrl(response.data.url);
            } catch (error) {
                console.error('Error creating payment URL:', error);
            }
        } else if (method === 'paypal') {
            const paymentResponse = await axios.post('https://spring-api-w8iy.onrender.com/paypal/pay', null, {
                params: {
                    sum: (data.price * 0.3) / 25455, // Số tiền thanh toán
                },
            });

            // Chuyển hướng người dùng sang trang thanh toán của PayPal
            setPaymentUrl(paymentResponse.data);
        } else {
            console.log('Payment method is not recognized, handle accordingly');
        }
    }

    
  
    const handleSubmitBook = async () => {
        // data.price = data.price * 0.3;
        data.note = note
        data.appointmentDate = formattedDate
        data.payment = paymentMethod
        const paymentData = {
            partientId: data.partientId,
            partientName: data.partientName,
            doctorId: data.doctorId,
            doctorName: data.doctorName,
            scheduledoctorId: data.scheduledoctorId,
            medicalExaminationDay: data.medicalExaminationDay,
            clinicHours: data.clinicHours,
            price: data.price * 0.3,
            note: data.note,
            appointmentDate: data.appointmentDate,
            payment: data.payment,
            status: data.status,
        };
        await addAppointment(data);
        console.log(paymentUrl)
        sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
        window.location.href = `${paymentUrl}`;
        
    };


    return (
        <Modal show={isOpen} onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Medical Examination Schedule Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Patient Name : {data?.partientName}</p>
                <p>Doctor Name :  {data?.doctorTitle} {data?.doctorName}</p>
                <p>Medical Examination Price : {data?.price} VNĐ</p>
                <p>Medical Examination Day : {formatDate(data?.medicalExaminationDay)}</p>
                <p>Medical Examination Hours : {data?.clinicHours}</p>
                <p>Amount To Be Paid To Reserve A Place : {data?.price * 0.3} VNĐ</p>
                <div>
                    <span>Note</span>
                    <TextArea value={note} onChange={(e) => handleChangeContent(e.target.value)} rows={4} />
                </div>
                <p>Select A Payment Method : </p>

                <div className='payment_choose'>
                    <div className=''>
                        <input type="radio" name="payment" id="vnpay_check" onClick={() => handlePaymentChange('vnpay')} />
                        <label htmlFor="vnpay_check"><img src="/images/vnpay.png" alt="" className='img_payment' /></label>
                    </div>
                    <div className=''>
                        <input type="radio" name="payment" id="paypal_check" onClick={() => handlePaymentChange('paypal')} />
                        <label htmlFor="paypal_check"><img src="/images/paypal.png" alt="" className='img_payment' /></label>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmitBook} disabled={isDisabled}>
                    {isDisabled ? `Chờ ${countdown}s để thanh toán` : 'Thanh toán để hoàn tất booking'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Payment