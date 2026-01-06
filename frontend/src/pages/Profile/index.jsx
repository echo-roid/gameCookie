import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Toast } from '../../components/Toast.jsx';
import { Games } from '../../components/Games.jsx';

import AuthService from "../../services/auth.service";
import Helper from "../../helper";
import UserService from "../../services/user.service";
import FavoriteService from "../../services/favorite.service";
import Seo from '../../components/Seo.jsx';

import { useAuth } from "../../contexts/AuthContext";

export function Profile(props) {

    const [activeTab, setActiveTab] = useState('favorites');
    const [showEditModal, setShowEditModal] = useState(false);
    const [favoriteData, setFavoriteData] = useState(undefined);

    const userData = AuthService.getCurrentUser();


    useEffect(() => {
        getFavorite();
    }, []);

    const getFavorite = () => {
    
        FavoriteService.myFavorite().then(
            (response) => {
                setFavoriteData(response.data.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    

	return (
		<>

        {/* <Seo
            title="My Profile – GamesCookie"
            description="Manage your GamesCookie profile, view your gaming stats, saved scores, and account settings. Customize your experience across our free online HTML5 games."
            keywords="GamesCookie profile, user profile, gaming stats, account settings, saved games, online game profile"
            canonical={`${import.meta.env.VITE_BASE_URL}/profile`}
            ogType="profile"
            /> */}

            <div className="min-vh-100">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="container">
                        <div className="row align-items-center">
                        <div className="col-md-auto">
                            <div className="profile-avatar mb-3 mb-md-0">
                                {userData.image ? (
                                <img src={`${import.meta.env.VITE_BASE_URL}/avatars/${userData?.image}`} />
                                ) : (
                                userData.initial
                                )}
                                {/* <button className="avatar-edit-btn" onClick={() => setShowEditModal(true)}>
                                    <i className="fas fa-camera"></i>
                                </button> */}
                            </div>
                        </div>
                        <div className="col-md">
                            <h2 className="fw-bold mb-2">{userData.name}</h2>
                            <p className="mb-2 opacity-75">
                            <i className="fas fa-envelope me-2"></i>{userData.email}
                            </p>
                            <p className="mb-0 opacity-75">
                                <i className="fas fa-calendar me-2"></i>Joined {Helper.dateFormat(userData.createdAt)}
                            </p>
                        </div>
                        <div className="col-md-auto mt-3 mt-md-0">
                            <button className="btn btn-primary-custom" onClick={() => setShowEditModal(true)}>
                            <i className="fas fa-edit me-2"></i>Edit Profile
                            </button>
                        </div>
                        </div>
                    </div>
                </div>


                {/* Profile Content */}
                <div className="container my-4">
                    {/* Tabs */}
                    {/* <ul className="nav nav-tabs nav-tabs-custom mb-4">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                <i className="fas fa-heart me-2"></i>Favorites
                            </button>
                        </li>
                    </ul> */}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="container rtx" id="allgames">
                            <h2 className="section-title"><i className="fas fa-layer-group"></i> Favorite Games</h2>
                            <div id="games-grid" className="row p-2">
                            {/* <div className="row p-2" id="games-grid"> */}
                                {favoriteData?.length > 0 && favoriteData.map((fav, idx) => {
                                    let game = fav.game;
                                        game.isFavourite = true;

                                    return (
                                        <Games
                                            game={fav.game}
                                            user={userData}
                                            getFavorite={getFavorite}
                                            />
                                    )
                                })}
                                {(!favoriteData || favoriteData?.length <= 0 ) &&
                                    <p>
                                    No favourite games found.
                                    </p>
                                }
                            </div>
                        </div>
                    )}

                </div>
            </div>


            {/* Edit Profile Modal */}
            {showEditModal && (
                <ProfileModal
                    setShowEditModal={setShowEditModal}
                    userData={userData}
                    getUser={props.getUser}
                    />
            )}
        </>
    )
}





function ProfileModal(props) {

    const { getUser } = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: props.userData.name,
            image: props.userData.image,
        },
    });


    const [avatarModal, setAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(props.userData.image || '1.jpeg');

    const handleAvatarClick = () => {
        document.getElementById('avatar-upload')?.click();
    };
        
    const submitForm = async (data) => {
        // const folderName = 'profile';

        // if (data.image[0]?.size) {
        //     const selectedFile = data.image[0]; // Access the first selected file

        //     const formData = new FormData();
        //     formData.append('image', selectedFile); // 'file' is the key your backend expects

        //     //...file upload
        //     await UserService.fileUpload(folderName, formData).then(
        //         (response) => {
        //             data.image = response.data.path;
        //         },
        //         error => {
        //             console.log("error", error)
        //             Toast('error', error);
        //         }
        //     );
        // }
        data.image = selectedAvatar;

        UserService.update(data.name, data.image).then(
            (response) => {
                
                props.setShowEditModal(false);
                Toast('success', response?.data.message);
                getUser();
            },
            error => {
                console.log("error", error)
                Toast('error', error?.response?.data?.message);
            }
        );

    };

    

    return (
        <>
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-content-custom">
                        <div className="modal-header modal-header-custom">
                            <h5 className="modal-title fw-bold">
                            <i className="fas fa-edit me-2"></i>Edit Profile
                            </h5>
                            <button 
                            type="button" 
                            className="btn-close btn-close-custom" 
                            onClick={() => props.setShowEditModal(false)}
                            >×</button>
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={handleSubmit(submitForm)}>
                            
                                {/* Profile Picture Upload Section */}
                                <div className="avatar-upload-section">
                                    <div className="avatar-preview">
                                        {props.userData.image ? (
                                        <img src={`${import.meta.env.VITE_BASE_URL}/avatars/${selectedAvatar}`} />
                                        ) : (
                                        props.userData.initial
                                        )}
                                    </div>
                                    <div>
                                        <div className="upload-btn-wrapper">
                                            {/* 
                                            <button type="button" className="btn btn-primary-custom" onClick={() => handleAvatarClick()}>
                                                <i className="fas fa-camera me-2"></i>
                                                {props.userData.profilePic ? 'Change Photo' : 'Upload Photo'}
                                            </button> 
                                            
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                {...register('image', {
                                                    validate: (value) => {
                                                        if (!value || value.length === 0) {
                                                            //return 'Image is required';
                                                            return true;
                                                        }
                                                        else {
                                                            const file = value[0];
                                                            const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 2MB

                                                            if (file.size > MAX_FILE_SIZE_BYTES) {
                                                            return 'File size exceeds 2MB limit';
                                                            }
                                                            // if (!file.type.startsWith('image/')) {
                                                            // return 'Only image files are allowed';
                                                            // }
                                                            return true; // Validation passed
                                                        }
                                                    },
                                                })}
                                            />
                                            */}

                                            <button type="button" className="btn btn-primary-custom" onClick={() => setAvatarModal(true)}>
                                                <i className="fas fa-camera me-2"></i>
                                                Choose Avatar
                                            </button>
                                            
                                        </div>
                                    </div>
                                    {errors.image && (
                                        <span className="error-message">
                                            {errors.image.message}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label-custom">Username</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/\s/g, '');
                                        }}
                                        {...register('name', {
                                            required: 'Username is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Username must be at least 6 characters long'
                                            },
                                            pattern: {
                                                value: /^(?![-_])[a-zA-Z0-9_-]+(?<![-_])$/,
                                                message: 'Only letters, numbers, hyphen (-), and underscore (_) are allowed'
                                            }
                                        })}
                                    />
                                    {errors.name && (
                                        <span className="error-message">
                                            {errors.name.message}
                                        </span>
                                    )}
                                </div>
                                
                                
                                <div className="d-flex gap-3">
                                    <button type="submit" className="btn btn-primary-custom flex-grow-1">
                                        <i className="fas fa-save me-2"></i>Save Changes
                                    </button>
                                    <button className="btn btn-secondary-custom flex-grow-1" onClick={() => props.setShowEditModal(false)}>
                                        <i className="fas fa-times me-2"></i>Cancel
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            {avatarModal &&
            <AvatarPopup
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
                setAvatarModal={setAvatarModal}
                />
            }
        </>
    )
}


function AvatarPopup(props) {
    
    const [selected, setSelected] = useState(props.selectedAvatar);

    const avatars = [
        "1.jpeg",
        "2.jpeg",
        "3.jpeg",
        "4.jpeg",
        "5.jpeg",
        "6.jpeg",
        "7.jpeg",
        "8.jpeg",
        "9.jpeg",
        "10.jpeg",
    ];

    const handleSubmitAvatar = () => {
        props.setSelectedAvatar(selected);
        props.setAvatarModal(false)
    };

    return (
        <>
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-content-custom">
                        <div className="modal-header modal-header-custom">
                            <h5 className="modal-title fw-bold">
                            <i className="fas fa-edit me-2"></i>Select Avatar
                            </h5>
                            <button 
                            type="button" 
                            className="btn-close btn-close-custom" 
                            onClick={() => props.setAvatarModal(false)}
                            >×</button>
                        </div>
                        <div className="modal-body p-4">

                            <div className="mb-4">
                            {avatars.map((img, index) => (
                                <img
                                key={index}
                                src={`${import.meta.env.VITE_BASE_URL}/avatars/${img}`}
                                onClick={() => setSelected(img)}
                                className={`avatar-img ${selected === img ? 'selected' : ''}`}
                                />
                            ))}
                            </div>

                                
                            <div className="d-flex gap-3">
                                <button type="submit" className="btn btn-primary-custom flex-grow-1" onClick={handleSubmitAvatar}>
                                    <i className="fas fa-save me-2"></i>Save Changes
                                </button>
                                <button className="btn btn-secondary-custom flex-grow-1" onClick={() => props.setAvatarModal(false)}>
                                    <i className="fas fa-times me-2"></i>Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}