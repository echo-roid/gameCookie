import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PartnerService from "../../services/partner.service";
import UserService from "../../services/user.service";

import { Toast } from '../Toast.jsx';

export function Partner(props) {

    const [headerTitle, setHeaderTitle] = useState('PARTNER WITH US');
    const [showForm, setShowForm] = useState('default');

    const triggerForm = (type) => {
        if(type=='html_games'){
            setHeaderTitle('ADD HTML5 GAMES TO YOUR APP / WEBSITE');
        }

        if(type=='apply_job'){
            setHeaderTitle('APPLY FOR A JOB AT GAMESCOOKIE');
        }

        setShowForm(type);

    };
    
    return (
        <>
            <div className="modal-overlay" onClick={() => props.setIsPartnerModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{headerTitle}</h5>
                        <button className="btn-close" onClick={() => props.setIsPartnerModalOpen(false)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="login-form">

                            {showForm == 'default' &&
                            <>
                            <div className="social-login">
                                <button className="social-btn" onClick={() => triggerForm('html_games')}>
                                    ADD HTML5 GAMES TO YOUR APP / WEBSITE
                                </button>
                            </div>

                            <div className="social-login">
                                <button className="social-btn" onClick={() => triggerForm('apply_job')}>
                                    APPLY FOR A JOB AT GAMESCOOKIE
                                </button>
                            </div>
                            </>
                            }

                            {showForm=='html_games' &&
							<HtmlGames
								setIsPartnerModalOpen={props.setIsPartnerModalOpen}
							    />
							}

                            {showForm=='apply_job' &&
							<ApplyJob
								setIsPartnerModalOpen={props.setIsPartnerModalOpen}
							    />
							}



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



function HtmlGames(props) {
    const { register, control, handleSubmit, formState: { errors } } = useForm();

    const handleForm = (data) => {

        PartnerService.createHtmlGames(data).then(
            (response) => {
                Toast('success', response?.data.message);
                props.setIsPartnerModalOpen(false);
            },
            error => {
                console.log("error", error)
                Toast('error', error?.response?.data.message || error);
            }
        );
        
    };


    
    return (
        <>
            <form class="w-100" onSubmit={handleSubmit(handleForm)}>

                {/* Name Field */}            
                <div class="mb-4">
                    <label className="form-label"><i className="fas fa-user"></i> Name</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        {...register('name', {
                            required: 'Name is required',
                        })}
                    />
                    {errors.name && (
                        <span className="error-message mb-2">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* Number Field */}            
                <div class="mb-4">
                    <label className="form-label"><i className="fas fa-phone"></i> Mobile Number</label>
                    <input
                        className="form-control"
                        type="number"
                        name="number"
                        placeholder="Enter mobile number"
                        {...register('number', {
                            required: 'Mobile number is required',
                        })}
                    />
                    {errors.number && (
                        <span className="error-message mb-2">
                            {errors.number.message}
                        </span>
                    )}
                </div>

                {/* Website url Field */}            
                <div class="mb-4">
                    <label className="form-label"><i className="fas fa-globe"></i> Enter your website url</label>
                    <input
                        className="form-control"
                        type="text"
                        name="website_url"
                        placeholder="Enter your website url"
                        {...register('website_url', {
                            required: 'Website url is required',
                            pattern: {
                                // ✅ allows with or without http(s)
                                value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w.-]*)*\/?$/i,
                                message: "Enter a valid domain or URL",
                            },
                        })}
                    />
                    {errors.website_url && (
                        <span className="error-message mb-2">
                            {errors.website_url.message}
                        </span>
                    )}
                </div>

                <button type="submit" className="btn-login-submit">
                    <i className="fas fa-sign-in-alt"></i> SUBMIT
                </button>
            </form>
        </>
    );
}

function ApplyJob(props) {
    const { register, control, handleSubmit, formState: { errors } } = useForm();

    const handleForm = async (data) => {

        const folderName = 'resume';
        if (data.resume[0]?.size) {
            const selectedFile = data.resume[0]; // Access the first selected file

            const formData = new FormData();
            formData.append('pdf', selectedFile); // 'file' is the key your backend expects

            //...file upload
            await UserService.pdfUpload(folderName, formData).then(
                (response) => {
                    data.resume = response.data.path;
                },
                error => {
                    console.log("error", error)
                    Toast('error', error);
                }
            );
        }

        PartnerService.createApplyJob(data).then(
            (response) => {
                Toast('success', response?.data.message);
                props.setIsPartnerModalOpen(false);
            },
            error => {
                console.log("error", error)
                Toast('error', error?.response?.data.message || error);
            }
        );
        
    };

    return (
        <>
            <form class="w-100" onSubmit={handleSubmit(handleForm)}>

                {/* Name Field */}            
                <div class="mb-4">
                    <label className="form-label"><i className="fas fa-user"></i> Name</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        {...register('name', {
                            required: 'Name is required',
                        })}
                    />
                    {errors.name && (
                        <span className="error-message mb-2">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* resume Field */}            
                <div class="mb-4">
                    <label class="col-form-label"><i className="fas fa-file-pdf"></i> Upload Resume (File should be in PDF Format)</label>
                    <input
                        className="form-control"
                        type="file"
                        name="resume"
                        accept="application/pdf"
                        {...register('resume', {
                            required: 'Resume is required',
                        })}
                    />
                    {errors.resume && (
                        <span className="error-message">
                            {errors.resume.message}
                        </span>
                    )}
                </div>

                <button type="submit" className="btn-login-submit">
                    <i className="fas fa-sign-in-alt"></i> SUBMIT
                </button>
            </form>
        </>
    );
}