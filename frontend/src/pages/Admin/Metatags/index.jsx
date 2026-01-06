import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useForm } from 'react-hook-form';

import MetatagsService from "../../../services/metatags.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";
import { Toast } from '../../../components/Toast.jsx';
import Swal from 'sweetalert2';

export function AdminMetatags(props) {
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

        MetatagsService.findAll(page).then(
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

    const deleteMetatags = (data) => {
        Swal.fire({
            title: "Do you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteConfirm(data);
            }
        });
        
    };

    const deleteConfirm = async (data) => {
        
        MetatagsService.delete(data.id).then(
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



    return (
        <>
            <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h5><i className="fas fa-th-large"></i> Metatags</h5>
                    <button className="btn-admin btn-primary-admin" onClick={()=>handleModal(true)}>
                    <i className="fas fa-plus"></i> Add New
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content && data.content.map((item, index) => (
                        <tr key={index}>
                            <td>{SerialNumber(index, data.currentPage, data.limit)}</td>
                            <td>{item.type}</td>
                            <td>{item.title}</td>
                            <td>
                                <button className="btn-admin btn-primary-admin btn-icon" onClick={()=>editSlider(item)}><i className="fas fa-edit"></i></button>
                                <button className="btn-admin btn-danger-admin btn-icon" onClick={()=>deleteMetatags(item)}><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                
                {data?.totalPages>1 &&
                <Pagination
                    route='metatags'
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
            keyword: '',
            description: '',
            type: ''
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
            keyword: props.editData?.keyword || '',
            description: props.editData?.description || '',
            type: props.editData?.type || ''
        });
    };
         
    const submitForm = async (data) => {
        

        if(props.isEdit){
            MetatagsService.update(props.editData?.id, data).then(
                (response) => {
                    props.getData(page);
                    props.handleModal(false);
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    Toast('error', error?.response?.data?.message);
                }
            );
        }
        else {
            MetatagsService.create(data).then(
                (response) => {
                    props.getData(page);
                    props.handleModal(false);
                    Toast('success', response?.data.message);
                },
                error => {
                    console.log("error", error)
                    Toast('error', error?.response?.data?.message);
                }
            );
        }

        reset({
            title: '',
            keyword: '',
            description: '',
            type: ''
        });
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-plus"></i> Add /Edit Metatags</h5>
                        <button type="button" className="btn-close" onClick={()=>props.handleModal(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div class="modal-body">
                            
                            {/* title Field */}
                            <div>
                                <label class="col-form-label">Title:</label>
                                <textarea
                                    className="form-control"
                                    name="title"
                                    {...register('title', {
                                        required: 'Title is required'
                                    })}
                                />
                                {errors.title && (
                                    <span className="error-message">
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>

                            {/* keyword Field */}
                            <div>
                                <label class="col-form-label">Keyword:</label>
                                <textarea
                                    className="form-control"
                                    name="keyword"
                                    {...register('keyword', {
                                        required: 'Keyword is required'
                                    })}
                                />
                                {errors.keyword && (
                                    <span className="error-message">
                                        {errors.keyword.message}
                                    </span>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label class="col-form-label">Description:</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    {...register('description', {
                                        required: 'Description is required'
                                    })}
                                />
                                {errors.description && (
                                    <span className="error-message">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* type Field */}
                            <div>
                                <label class="col-form-label">Type:</label>
                                <select className="form-control" {...register("type", { required: "Type is required" })}
                                    disabled={props.isEdit?true:false}
                                    >
                                    <option value="">--Please select type--</option>
                                    <option value="home">Home</option>
                                    <option value="games">Games</option>
                                    <option value="profile">Profile</option>
                                    <option value="about">About</option>
                                    <option value="privacy">Privacy Policy</option>
                                    <option value="terms">Terms of Use</option>
                                </select>
                                {errors.type && (
                                    <span className="error-message">
                                        {errors.type.message}
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



