import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const [email_id, setEmailId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [hasUppercase, setHasUppercase] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const toggleShow = () => {
        setShow(true);
        setTimeout(() => setShow(false), 3000);
    };

    const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailId(e.target.value);
        setError('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsValid(specialCharacterRegex.test(newPassword));
        setHasUppercase(uppercaseRegex.test(newPassword));
        setHasNumber(numberRegex.test(newPassword));
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getLoggedUser = async () => {
        const token = JSON.parse(localStorage.getItem('user')!)?.tokens?.access;
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        if(response){
            console.log(response);
            // setLoggedUser(response);
        }
            // return response.data;
        } catch (error) {
            console.error('Error fetching logged user:', error);
            throw error;
        } 
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let errorMessage = '';

        if (!email_id.trim() && !password.trim()) {
            errorMessage = 'Email and Password are required';
        } else if (!email_id.trim()) {
            errorMessage = 'Email required';
        } else if (!password.trim()) {
            errorMessage = 'Password required';
        } else if (password.length < 8) {
            errorMessage = "Password length should be at least 8";
        } else if (!isValid) {
            errorMessage = "Password must contain at least one special character";
        } else if (!hasUppercase) {
            errorMessage = "Password must contain at least one uppercase letter";
        } else if (!hasNumber) {
            errorMessage = "Password must contain at least one number";
        }

        if (errorMessage) {
            setError(errorMessage);
            toggleShow();
        } else {
            try {
                const url = '/users/login/';
                const response = await axios.post(url, { email_id, password });

                if (response) {
                    localStorage.setItem('user', response.toString()); // Save the token
                    getLoggedUser();
                    const user = await getLoggedUser(); // Fetch logged user info
                    setEmailId('');
                    setPassword('');
                    setError('');
                    //navigate('/content', { state: { email_id: user.email_id} });
                } else {
                    alert('Invalid Email or Password');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                if (axios.isAxiosError(error)) {
                    console.log('Axios error details:', error.response); // Log Axios error response
                    if (error.response?.status === 401) {
                        alert('Unauthorized: Please check your credentials.');
                    } else {
                        alert('Error logging in. Please try again later.');
                    }
                } else {
                    alert('Unexpected error occurred. Please try again later.');
                }
            }
        }
    };

    return (
        <div id="main">
            <h1>Hello, Welcome to Tarento!</h1>
            <p>Great place to work</p>
            <div id="myDiv">
                <form onSubmit={handleSubmit}>
                    <div id="formheader">
                        <h4>Login</h4>
                        <h6 className="light-color">Enter your email and password to login</h6>
                    </div>
                    <div className="formbody">
                        <label className="bold-label">Email : </label>
                        <br />
                        <input type='email' name="email_id" className={`form-control ${error && !email_id.trim() ? 'is-invalid' : ''}`} value={email_id} placeholder="Enter your email" onChange={handleEmailIdChange}></input>
                        <br />
                        <label className="bold-label">Password :  </label>
                        <br />
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control ${error && !password.trim() ? 'is-invalid' : ''}`}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        <br />
                        <button id="button" type="submit">Submit</button>
                    </div>
                    <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '200px' }}>
                        <div className="toast-container position-absolute top-0 end-0 p-3">
                            <div className={`toast ${show ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <strong className="me-auto">Error</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShow(false)}></button>
                                </div>
                                <div className="toast-body">
                                    <h4 id="error">{error}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

/*navigate('/mainpage', { state: { name: user.name, email_id: user.email_id, role: user.role, index: user.index } });*/
