import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Routers from "./route/Routers";
import { useEffect, useState } from "react";
import getUserData from "./route/CheckRouters/token/Token";


function App() {
  return (
    <Router>
      <Routers/>
    </Router>
  )
}

// const App = () => {
//   return (
//     <Router>
//       <RoleBasedRedirect />
//     </Router>
//   );
// };

// const RoleBasedRedirect = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userData = getUserData();
//     if (userData && userData.user.roles[0]) {
//       if (userData.user.roles[0] === 'ADMIN') {
//         navigate('/dashboard/admin');
//       } else if (userData.user.roles[0] === 'DOCTOR') {
//         navigate('/dashboard/doctor');
//       } else {
//         navigate('/');
//       }
//     }
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return <div></div>;
//   }

//   return <Routers />;
// };

export default App
