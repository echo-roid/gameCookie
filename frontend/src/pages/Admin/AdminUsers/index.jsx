import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useForm } from 'react-hook-form';

import UserService from "../../../services/user.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";
import { Toast } from '../../../components/Toast.jsx';

export function AdminRoleUsers() {
    const { url, query } = useLocation();
    const [data, setData] = useState(undefined);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(undefined);

    let page = 1;
    let role = 'admin';
    useEffect(() => {
        if(query?.page) {
            page = parseInt(query.page);
        }

        getUsers(page);
    }, [url]);

    const getUsers = (page) => {

        UserService.findAll(page, role).then(
            (response) => {
                setData(response.data);
            },
            error => {
                console.log("error", error)
            }
        );
    };

    
    const editUser = (data) => {
        setIsEdit(true);
        setEditData(data);
        handleModal(true);
    };

    const handleModal = (res) => {
        if(modalOpen){
            setIsEdit(false);
            setEditData(undefined);
        }
        //...
        setModalOpen(res);
    };

	return (
		<>
            <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h5><i className="fas fa-users"></i> Admin User Management</h5>
                    <button className="btn-admin btn-primary-admin" onClick={()=>handleModal(true)}>
                    <i className="fas fa-plus"></i> Add New
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content && data.content.map((user, index) => (
                        <tr key={user.id}>
                            <td scope="row">{SerialNumber(index, data.currentPage, data.limit)}</td>
                            <td>
                                {/* {user.image &&
                                    <img width="100" height="100" src={`${import.meta.env.VITE_API}/${user.image}`}/>
                                } */}

                                {user.image ? (
                                <img width="75" height="75" src={`${import.meta.env.VITE_BASE_URL}/avatars/${user.image}`} />
                                ) : (
                                <img width="75" height="75" src={`${import.meta.env.VITE_BASE_URL}/avatars/1.jpeg`} />
                                )}
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span className={`badge badge-${user.status ? 'success' : 'warning'}`}>{user.status ? 'Active' : 'In-active'}</span></td>
                            <td>
                                <button className="btn-admin btn-primary-admin btn-icon" onClick={()=>editUser(user)}><i className="fas fa-edit"></i></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {data?.totalPages>1 &&
                <Pagination
                    route='admin_users'
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    />
                }
            </div>
            
            {modalOpen &&
            <UserForm
                handleModal={handleModal}
                getUsers={getUsers}
                isEdit={isEdit}
                editData={editData}
                />
            }
        </>
	);
}




function UserForm(props) {
    const { query } = useLocation();
    let page = query.page ?? 1;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            image: '',
            status: ''
        },
    });

    useEffect(() => {
        // Reset the form with new data when initialData changes
        reset();
        if(props.isEdit){
            handleResetWithNewDefaults();
        }
    }, []);

    const handleResetWithNewDefaults = () => {
        reset({
            name: props.editData?.name || '',
            email: props.editData?.email || '',
            image: props.editData?.image || '',
            status: props.editData?.status ? '1' : '0',
        });
    };
        
    const submitForm = async (data) => {

        
        const folderName = 'profile';

        if (data.image[0]?.size) {
            const selectedFile = data.image[0]; // Access the first selected file

            const formData = new FormData();
            formData.append('image', selectedFile); // 'file' is the key your backend expects

            //...file upload
            await UserService.fileUpload(folderName, formData).then(
                (response) => {
                    data.image = response.data.path;
                },
                error => {
                    console.log("error", error)
                    Toast('error', error);
                }
            );
        }

   

        if(props.isEdit){
            UserService.updateAdmin(props.editData?.id, data).then(
                (response) => {
                    props.getUsers(page);
                    props.handleModal(false);
                    resetForm();
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    Toast('error', error?.response?.data.message || error);
                }
            );
        }
        else {
            UserService.createAdmin(data).then(
                (response) => {
                    props.getUsers(page);
                    props.handleModal(false);
                    resetForm();
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    // Toast('error', error);
                    Toast('error', error?.response?.data.message || error);
                }
            );
        }

        
    };


    const resetForm = () => {
        reset({
            name: '',
            email: '',
            image: '',
            status: ''
        });
    }

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-plus"></i> Add/Edit Admin User</h5>
                        <button type="button" className="btn-close" onClick={()=>props.handleModal(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div class="modal-body">
                            
                            {/* name Field */}
                            <div>
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

                            {/* email Field */}
                            <div>
                                <label class="col-form-label">Email:</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    {...register('email', {
                                        required: 'Email is required'
                                    })}
                                />
                                {errors.email && (
                                    <span className="error-message">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>


                            {/* image Field */}
                            {/* <div>
                                <label class="col-form-label">Image:</label>
                                {props.editData?.image &&
                                <>
                                    <br/>
                                    <img width="200" height="200" src={`${import.meta.env.VITE_API}/${props.editData?.image}`}/>
                                    <br/>
                                </>
                                }
                                <input
                                    className="form-control"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    {...register('image', {
                                        // required: 'Image is required',
                                    })}
                                />
                                {errors.image && (
                                    <span className="error-message">
                                        {errors.image.message}
                                    </span>
                                )}
                            </div> */}

                            {/* Status Field */}
                            <div>
                                <label class="col-form-label">Status:</label>
                                <select className="form-control" {...register("status", { required: "Status is required" })}>
                                    <option value="">--Please select status--</option>
                                    <option value="1">Active</option>
                                    <option value="0">In-active</option>
                                </select>
                                {errors.status && (
                                    <span className="error-message">
                                        {errors.status.message}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn-admin btn-primary-admin">
                                    <i className="fas fa-save"></i> Save
                                </button>
                                <button onClick={()=>props.handleModal(false)} className="btn-admin btn-danger-admin">
                                    Cancel
                                </button>
                            </div>
                            
                        </div>
                    </form>

                </div>
            </div>
                
        </>
    )
}



