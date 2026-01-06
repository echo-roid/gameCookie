import { useLocation } from 'preact-iso';
import { useState } from 'react';
import AuthService from "../../services/auth.service";
import { useForm, Controller } from 'react-hook-form';
import { MuiOtpInput } from 'mui-one-time-password-input';

import { Toast } from '../Toast.jsx';
import { useAuth } from "../../contexts/AuthContext";

export function LoginModal(props) {
    const { isLoginOpen, closeLogin, getUser } = useAuth();
    if (!isLoginOpen) return null;

    const { route } = useLocation();
    
    const { register, control, handleSubmit, formState: { errors } } = useForm();
    
    const [otpForm, setOtpForm] = useState(false);
    const [formData, setFormData] = useState(undefined);

    const handleLogin = (data) => {

        // data.role = "user";
        // data.type = "register";
        const loginData = {
            ...data,
            role: "user",
            type: "register",
        }
        
        //...
        setFormData(loginData);
        if(loginData?.otp){
            loginWithOTP(loginData);
        }
        else {
            verifyOTP(loginData);
        }
        
    };



    const resendOTP = () => {
        verifyOTP(formData);
        // alert('OTP has been resent to your email!');
        Toast('success', 'OTP has been resent to your email!');
    };

    const backToLogin = () => {
        setOtpForm(false);
    };

    const verifyOTP = (data) => {
        AuthService.login(data.email, data.role, data.type).then(
            (response) => {
                setOtpForm(true);
            },
            error => {
                console.log("error", error)
                Toast('error', error?.response?.data.message || error);
            }
        );
    };

    const loginWithOTP = (data) => {
        AuthService.loginOtp(data.email, data.otp).then(
            (response) => {

                console.log('loginWithOTP', response)
                getUser();
                closeLogin();

                //redirect to home page
                // route("/");
                // window.location.href = "/";
            },
            error => {
                console.log("error", error)
                Toast('error', error?.response?.data.message || error);
            }
        );
    };



    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-user-circle"></i> Login to GamesCookie</h5>
                        <button className="btn-close" onClick={closeLogin}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="login-form">
                            <form class="w-100" onSubmit={handleSubmit(handleLogin)}>
                                
                                {!otpForm &&
                                <div class="mb-4">
                                    {/* Email Field */}
                                    <label className="form-label"><i className="fas fa-envelope"></i> Email Address</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: 'Email is invalid'
                                            }
                                        })}
                                    />
                                    {errors.email && (
                                        <span className="error-message mb-2">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>
                                }

                                {otpForm &&
                                <div class="mb-4">
                                    {/* OTP Field */}
                                    <label className="form-label"><i className="fas fa-envelope"></i> Verify OTP</label>
                                    <Controller
                                        name="otp"
                                        control={control}
                                        rules={{ 
                                            required: 'OTP is required',
                                            validate: (value) => value.length === 6 || 'OTP must be 6 digits' 
                                        }} // Example validation rules
                                        render={({ field, fieldState }) => (
                                        <>
                                            <MuiOtpInput {...field} length={6} />
                                            {fieldState.error && <span className="error-message">{fieldState.error.message}</span>}
                                        </>
                                        )}
                                    />
                                </div>
                                }
                                
                                <button type="submit" className="btn-login-submit" onClick={handleLogin}>
                                <i className="fas fa-sign-in-alt"></i> Login
                                </button>
                            </form>
                        </div>
                        
                        {/* for docial login */}
                        {/* {!otpForm &&
                        <>
                        <div className="divider">
                            <span>OR</span>
                        </div>
                        
                        <div className="social-login">
                            <button className="social-btn">
                                <i className="fab fa-google"></i> Google
                            </button>
                        </div>
                        </>
                        } */}

                        {/* for OTP */}
                        {otpForm &&
                        <>
                        <div className="text-center">
                            <p className="mb-0 opacity-75">
                            Didn't receive the code? <span className="btn-white" onClick={resendOTP}>Resend OTP</span>
                            </p>
                        </div>
                        
                        <div className="text-center mt-3 pt-3 border-top" style={{borderColor: 'rgba(248, 231, 28, 0.3)'}}>
                            <button 
                            className="btn btn-white p-0"
                            onClick={backToLogin}
                            >
                            <i className="fas fa-arrow-left me-2"></i>Back to Login
                            </button>
                        </div>
                        </>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}