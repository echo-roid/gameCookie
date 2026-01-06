import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useForm } from 'react-hook-form';

import UserService from "../../../services/user.service";
import HomeSliderService from "../../../services/homeslider.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";
import { Toast } from '../../../components/Toast.jsx';
import Swal from 'sweetalert2';

export function AdminHomeSlider(props) {
    const { url, query } = useLocation();
    const [data, setData] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);


    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(undefined);

    let page = 1;

    useEffect(() => {
        
        if(query?.page) {
            page = parseInt(query.page);
        }

        getData(page);
    }, [url]);

    const getData = (page) => {

        HomeSliderService.findAll(page).then(
            (response) => {
                setData(response.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const editSlider = (data) => {
        setIsEdit(true);
        setEditData(data);
        handleModal(true);
    };

    const deleteSlider =  (data) => {
        Swal.fire({
            title: "Do you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteConfirmSlider(data);
            }
        });
        
    };

    const deleteConfirmSlider = async (data) => {
        if(data.image){
            await deleteImage(data.image);
        }

        HomeSliderService.delete(data.id).then(
            (response) => {
                getData(page);
                Toast('success', response?.data.message);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const handleModal = (res) => {
        if(modalOpen){
            setIsEdit(false);
            setEditData(undefined);
        }
        //...
        setModalOpen(res);
    };

    const deleteImage = (image) => {
        UserService.deleteImage({fileName:image}).then(
            (response) => {
                return response;
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    return (
        <>
            <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h5><i className="fas fa-th-large"></i> Slider Management</h5>
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
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content && data.content.map((item, index) => (
                        <tr key={index}>
                            <td>{SerialNumber(index, data.currentPage, data.limit)}</td>
                            <td>
                                {item.image &&
                                <img width="50" height="50" src={`${import.meta.env.VITE_API}/${item.image}`}/>
                                }
                            </td>
                            <td>{item.title}</td>
                            <td><span className={`badge badge-${item.status ? 'success' : 'warning'}`}>{item.status ? 'Active' : 'In-active'}</span></td>
                            <td>
                                <button className="btn-admin btn-primary-admin btn-icon" onClick={()=>editSlider(item)}><i className="fas fa-edit"></i></button>
                                <button className="btn-admin btn-danger-admin btn-icon" onClick={()=>deleteSlider(item)}><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                
                {data?.totalPages>1 &&
                <Pagination
                    route='slider'
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    />
                }
                
            </div>

            {modalOpen &&
            <FormModal
                handleModal={handleModal}
                getData={getData}
                isEdit={isEdit}
                editData={editData}
                />
            }
        </>
    );
}


function FormModal(props) {
    const { query } = useLocation();
    let page = query.page ?? 1;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            icon: '',
            description: '',
            url: '',
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
            title: props.editData?.title || '',
            icon: props.editData?.icon || '',
            description: props.editData?.description || '',
            url: props.editData?.url || '',
            image: props.editData?.image || '',
            status: props.editData?.status ? '1' : '0',
        });
    };
         
    const submitForm = async (data) => {
        const folderName = 'slider';
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
            HomeSliderService.update(props.editData?.id, data).then(
                (response) => {
                    props.getData(page);
                    props.handleModal(false);
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    Toast('error', error);
                }
            );
        }
        else {
            HomeSliderService.create(data).then(
                (response) => {
                    props.getData(page);
                    props.handleModal(false);
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    Toast('error', error);
                }
            );
        }

        reset({
            title: '',
            icon: '',
            description: '',
            url: '',
            image: '',
            status: ''
        });
    };

	return (
		<>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-plus"></i> Add /Edit Home Slider</h5>
                        <button type="button" className="btn-close" onClick={()=>props.handleModal(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div class="modal-body">
                            
                            {/* title Field */}
                            <div>
                                <label class="col-form-label">Title:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    {...register('title', {
                                        required: 'Title is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Title must be at least 2 characters long'
                                        }
                                    })}
                                />
                                {errors.title && (
                                    <span className="error-message">
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>

                            {/* icon Field */}
                            <div>
                                <label class="col-form-label">Fa Icon:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="icon"
                                    {...register('icon', {
                                        required: 'Icon is required'
                                    })}
                                />
                                {errors.icon && (
                                    <span className="error-message">
                                        {errors.icon.message}
                                    </span>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label class="col-form-label">Description:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="description"
                                    {...register('description', {
                                        required: 'Description is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Description must be at least 2 characters long'
                                        }
                                    })}
                                />
                                {errors.description && (
                                    <span className="error-message">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>

                            {/* URL Field */}
                            <div>
                                <label class="col-form-label">Game URL:</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    name="url"
                                    {...register('url', {
                                        required: 'URL is required',
                                    })}
                                />
                                {errors.url && (
                                    <span className="error-message">
                                        {errors.url.message}
                                    </span>
                                )}
                            </div>

                            {/* image Field */}
                            <div>
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
                            </div>
                            
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



