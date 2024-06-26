import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { addAppointment } from '../../services/API/bookingService';

const Proccess = () => {
  const location = useLocation();
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const [data, setData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      setData(paymentData);
      const status = queryParams.get('status');
      if (status === 'success') {
        const storedPaymentData = sessionStorage.getItem('paymentData');
        var check = JSON.parse(storedPaymentData)
        console.log(storedPaymentData);
        if (storedPaymentData) {
          setPaymentData(check);
        }
        setMessage('Thanh toán thành công!');

        // try{
        //     await addAppointment(check);
        //     sessionStorage.removeItem('paymentData');
        //   }catch(error){
        // }
      } else {
        setMessage('Thanh toán thất bại!');
      }
    };

    processPayment();
  }, [location.search]);
  return (
    <div className='container mt-5'>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
          <div className="col-12">
            <img src="/images/payment_success.jpg" alt="" className='img-fluid' />
          </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-12">
              <h2>Kết quả thanh toán</h2>
              <p>{message}</p>
              {paymentData ? (
                <div>
                  <h3>Thông tin lịch book:</h3>
                  <div>
                    <p><strong>Patient Name:</strong> {paymentData.partientName}</p>
                    <p><strong>Doctor Name:</strong> {paymentData.doctorName}</p>
                    <p><strong>Medical Examination Day:</strong> {paymentData.medicalExaminationDay}</p>
                    <p><strong>Clinic Hours:</strong> {paymentData.clinicHours}</p>
                    <p><strong>Price:</strong> {paymentData.price}</p>
                    <p><strong>Note:</strong> {paymentData.note}</p>
                    <p><strong>Appointment Date:</strong> {paymentData.appointmentDate}</p>
                    <p><strong>Payment Method:</strong> {paymentData.payment}</p>
                    <p><strong>Status:</strong> {paymentData.status}</p>
                  </div>
                  <a className='btn btn-primary' href='/'>Quay về trang Home</a>
                </div>
              ) : (
                <p>No payment data stored in sessionStorage.</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proccess
