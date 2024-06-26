/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { AlertContext } from '../../../components/Layouts/DashBoard';

function Schedule() {
  const { Option } = Select;
  const [slots, setSlots] = useState([]);
  const [patients, setPatients] = useState({});
  const [appointments, setAppointments] = useState({});
  const { currentUser } = useContext(AlertContext);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlotData = async () => {
      if (!currentUser || !currentUser.user || !currentUser.user.id) return;
      try {
        const dayMonthYear = selectedDate.format('YYYY-MM-DD');
        const response = await axios.get(`https://spring-api-w8iy.onrender.com/api/schedules/doctor/${currentUser.user.id}/day/${dayMonthYear}`);
        const slotData = response.data;
        setSlots(slotData);
        slotData.forEach(slotItem => {
          fetchPatientData(slotItem.startTime, slotItem.scheduledoctorId);
          fetchAppointmentData(slotItem.startTime, slotItem.scheduledoctorId);
        });
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        message.error('Failed to fetch slot data');
      }
    };
    fetchSlotData();
  }, [currentUser, selectedDate]);

  const fetchPatientData = async (startTime, doctorId) => {
    try {
      const response = await axios.get(`https://spring-api-w8iy.onrender.com/api/patient/patientbyscheduledoctoridandstarttime/${doctorId}/${startTime}`);
      const patientData = response.data;
      setPatients(prevPatients => ({
        ...prevPatients,
        [`${startTime}-${doctorId}`]: patientData
      }));
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const fetchAppointmentData = async (startTime, doctorId) => {
    try {
      const response = await axios.get(`https://spring-api-w8iy.onrender.com/api/appointment/appointmentbyscheduledoctoridandstarttime/${doctorId}/${startTime}`);
      const appointmentData = response.data;
      setAppointments(prevAppointments => ({
        ...prevAppointments,
        [`${startTime}-${doctorId}`]: appointmentData
      }));
    } catch (error) {
      console.error('Error fetching appointment data:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (slotItem) => {
    setSelectedSlot(slotItem);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`https://spring-api-w8iy.onrender.com/api/appointment/changestatus/${appointmentId}/${newStatus}`);
      // Update appointments state after successful update
      const updatedAppointments = appointments[selectedSlot.startTime + '-' + selectedSlot.scheduledoctorId].map(appointment => {
        if (appointment.id === appointmentId) {
          return { ...appointment, status: newStatus };
        }
        return appointment;
      });
      setAppointments(prevAppointments => ({
        ...prevAppointments,
        [`${selectedSlot.startTime}-${selectedSlot.scheduledoctorId}`]: updatedAppointments
      }));
      message.success('Appointment status updated successfully');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return { border: '2px solid #1890ff' }; // blue
      case 'no show':
        return { border: '2px solid #fa8c16' }; // orange
      case 'cancel':
        return { border: '2px solid #f5222d' }; // red
      case 'finished':
        return { border: '2px solid #52c41a' }; // green
      default:
        return {};
    }
  };

  return (
    <div className="schedule">
      {/* <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ backgroundColor: '#52c41a', marginBottom: '16px' }}
      >
        Add New Schedule
      </Button> */}
      {/* <hr /> */}
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginBottom: '16px' }}
      />
      <div className="row">
        {slots.map((slotItem, index) => (
          <div key={index} className="col-lg-1">
            <div
              className="card mb-2"
              style={getStatusColor(appointments[`${slotItem.startTime}-${slotItem.scheduledoctorId}`]?.[0]?.status)}
              onClick={() => handleSlotClick(slotItem)}
            >
              <div className="card-header text-center">
                <strong>{slotItem.startTime}</strong>
              </div>
              <div className="card-body text-center p-0">
                {appointments[`${slotItem.startTime}-${slotItem.scheduledoctorId}`]?.[0]?.status === 'waiting' ? 'waiting'
                  : appointments[`${slotItem.startTime}-${slotItem.scheduledoctorId}`]?.[0]?.status === 'no show' ? 'no show'
                    : appointments[`${slotItem.startTime}-${slotItem.scheduledoctorId}`]?.[0]?.status === 'cancel' ? 'cancel'
                      : appointments[`${slotItem.startTime}-${slotItem.scheduledoctorId}`]?.[0]?.status === 'finished' ? 'finished'
                        : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      {selectedSlot && patients[`${selectedSlot.startTime}-${selectedSlot.scheduledoctorId}`] && (
        <div className="selected-slot-info">
          {patients[`${selectedSlot.startTime}-${selectedSlot.scheduledoctorId}`].map((patient, index) => (
            <table key={index} className='table align-middle'>
              <thead>
                <tr>
                  <th></th>
                  <th>Full Name</th>
                  <th>Birthday</th>
                  <th>Gender</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><img src={"https://spring-api-w8iy.onrender.com/images/patients/" + patient.image} alt="" width={'50px'} height={'50px'} style={{ borderRadius: '50%' }} /></td>
                  <td>{patient.fullName}</td>
                  <td>{patient.birthday}</td>
                  <td>{patient.gender}</td>
                  {appointments[`${selectedSlot.startTime}-${selectedSlot.scheduledoctorId}`].map((appointment, index) => (
                    <React.Fragment key={index}>
                      <td>{appointment.note}</td>
                      <td>
                        {/* {appointment.status} */}
                        {/* <br /> */}
                        <Select value={appointment.status} style={{ width: 120 }} onChange={(value) => handleStatusChange(appointment.id, value)}>
                          <Option value="no show">no show</Option>
                          {/* <Option value="CANCEL">Cancel</Option> */}
                          <Option value="finished">finished</Option>
                        </Select>
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      )}
    </div>
  );
}

export default Schedule;
