import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Indexx from './Indexx'; // Ensure this is correct
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import './App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/indexx" element={<Indexx />} />
                {/* 404 Route */}
                <Route path="*" element={<div>404: Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App;