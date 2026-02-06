import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './login';
import React from 'react';
import App from './App';
import Signup from './signup';
import Status from './status';
import Protectme from './protectme';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



export default function AppRouter() {
    return (<Router>
      <ToastContainer
      position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<Protectme><App/></Protectme>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/status/:status" element={<Status />} />
        </Routes>
    </Router>);
}