import React from 'react'
import { motion } from 'framer-motion';


const DepartmentCard = (props) => {
    const { id, name, icon, url} = props.item;
  return (
        <motion.div to={`/services/${id}`} className='card__department'>
            <div className='card__department_img'>
                <img src={"https://spring-api-w8iy.onrender.com/images/department/"+ icon} alt="" className='img-fluid image__icon' />
            </div>
            <div className='card__department_name'>
                {name}
            </div>
        </motion.div>
  )
}

export default DepartmentCard