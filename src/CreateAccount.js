// src/components/CreateAccount.js
import React, { useState } from 'react';
import './CreateAccount.css';

const CreateAccount = () => {
    const [passwordVisible, setPasswordVisible] = useState({
        newPassword: false,
        confirmPassword: false,
    });
    
    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const dob = document.getElementById('dob').value;
        const username = document.getElementById('username').value;

        fetch('http://localhost:3001/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                dob,
                username,
                password: newPassword,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Account created successfully!');
                    window.location.href = '/login'; // Redirect to login page
                } else {
                    return response.json().then((data) => {
                        alert(data.message || 'Error creating account');
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Server error. Please try again later.');
            });
        
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Create Account</h1>
                <form id="signupForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Choose a username" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="new-password">Password</label>
                        <input
                            type={passwordVisible.newPassword ? 'text' : 'password'}
                            id="new-password"
                            name="new-password"
                            placeholder="Enter your password"
                            required
                        />
                        <span className="toggle-password" onClick={() => togglePasswordVisibility('newPassword')}>
                            <i className={`fas ${passwordVisible.newPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type={passwordVisible.confirmPassword ? 'text' : 'password'}
                            id="confirm-password"
                            name="confirm-password"
                            placeholder="Confirm your password"
                            required
                        />
                        <span className="toggle-password" onClick={() => togglePasswordVisibility('confirmPassword')}>
                            <i className={`fas ${passwordVisible.confirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                    </div>
                    <div className="input-group">
                        <button type="submit">Create Account</button>
                    </div>
                </form>
                <div className="links">
                    <a href="/login">Already have an account?</a>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
