import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useForm, Controller } from 'react-hook-form';

import UserService from "../../../services/user.service";
import GamesService from "../../../services/games.service";
import CategoryService from "../../../services/category.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";
import { Toast } from '../../../components/Toast.jsx';
import Swal from 'sweetalert2';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function AdminGames() {
    const { url, query } = useLocation();
    const [data, setData] = useState(undefined);
    const [categories, setCategories] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(undefined);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    let page = 1;
    useEffect(() => {
        if(query?.page) {
            page = parseInt(query.page);
        }

        getGames(page);
        getCategories();
    }, [url]);


    const getCategories = () => {
    
        CategoryService.findAllActive().then(
            (response) => {
                setCategories(response.data.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const getGames = (page, status = 'All', search = '') => {

        GamesService.findAll(page, status, search).then(
            (response) => {
                setData(response.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');

        getGames(1, 'All', '');
        
    };


    const editGame = (data) => {
        setIsEdit(true);
        // setEditData({ title: data.title });
        setEditData(data);
        handleModal(true);
    };

    const deleteGame = (data) => {
        Swal.fire({
            title: "Do you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteConfirmGame(data);
            }
        });
    };


    const deleteConfirmGame = async (data) => {
        if(data.image){
            await deleteImage(data.image);
        }

        GamesService.delete(data.id).then(
            (response) => {
                getGames(page);
                Toast('success', response?.data.message);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
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

    const handleModal = (res) => {
        if(modalOpen){
            setIsEdit(false);
            setEditData(undefined);
        }
        //...
        setModalOpen(res);
    };

    const searchFilters = () => {
        //...
        getGames(1, statusFilter, searchTerm);
    };


    return (
        <>
            <div className="content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h5><i className="fas fa-gamepad"></i> Games Management</h5>
                    <button className="btn-admin btn-primary-admin" onClick={()=>handleModal(true)}>
                    <i className="fas fa-plus"></i> Add New
                    </button>
                </div>


                {/* Search and Filter Section */}
                <div style={{ marginBottom: '20px', padding: '15px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        {/* Search Input */}
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label className="col-form-label" style={{ marginBottom: '5px', display: 'block' }}>
                                <i className="fas fa-search"></i> Search
                            </label>
                            <input
                                type="text"
                                className="form-control mb-0"
                                placeholder="Search by title or category..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Status Filter */}
                        <div style={{ minWidth: '150px' }}>
                            <label className="col-form-label" style={{ marginBottom: '5px', display: 'block' }}>
                                <i className="fas fa-filter"></i> Status
                            </label>
                            <select
                                className="form-control mb-0"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="All">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">In-active</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        {/* {(searchTerm || statusFilter !== 'All') && ( */}
                        <>
                        <div>
                            <button
                                className="btn-admin btn-success-admin"
                                onClick={()=>searchFilters()}
                                style={{ marginBottom: '2px' }}
                            >
                                <i className="fas fa-search"></i> Search
                            </button>
                        </div>
                        <div>
                            <button
                                className="btn-admin btn-danger-admin"
                                onClick={clearFilters}
                                style={{ marginBottom: '2px' }}
                            >
                                <i className="fas fa-times"></i> Clear Filters
                            </button>
                        </div>
                        </>
                        {/* )} */}
                    </div>
                </div>



                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.content && data.content.map((item, index) => (
                            <tr key={index}>
                                <td scope="row">{SerialNumber(index, data.currentPage, data.limit)}</td>
                                <td>
                                    {item.image &&
                                        <img width="100" height="100" src={`${import.meta.env.VITE_API}/${item.image}`}/>
                                    }
                                </td>
                                <td>{item.title}</td>
                                <td>{item.category.title}</td>
                                <td><span className={`badge badge-${item.status ? 'success' : 'warning'}`}>{item.status ? 'Active' : 'In-active'}</span></td>
                                <td>
                                    <button className="btn-admin btn-primary-admin btn-icon" onClick={()=>editGame(item)}><i className="fas fa-edit"></i></button>
                                    <button className="btn-admin btn-danger-admin btn-icon" onClick={()=>deleteGame(item)}><i className="fas fa-trash"></i></button>

                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                
                {data?.totalPages>1 &&
                <Pagination
                    route='games'
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    />
                }
                
            </div>

            {modalOpen &&
            <GamesForm
                handleModal={handleModal}
                isEdit={isEdit}
                editData={editData}
                categories={categories}
                getGames={getGames}
                />
            }
        </>
    );
}



function GamesForm(props) {
    const { query } = useLocation();
    let page = query.page ?? 1;

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            image: '',
            categoryId: '',
            game_url: '',
            description: '',
            meta_title: '',
            meta_keywords: '',
            meta_description: '',
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
            image: props.editData?.image || '',
            categoryId: props.editData?.categoryId || '',
            game_url: props.editData?.game_url || '',
            description: props.editData?.description || '',
            meta_title: props.editData?.meta_title || '',
            meta_keywords: props.editData?.meta_keywords || '',
            meta_description: props.editData?.meta_description || '',
            status: props.editData?.status ? '1' : '0',
        });
    };
        
    const submitForm = async (data) => {

        console.log('page', page)
        
        const folderName = 'games';

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
            GamesService.update(props.editData?.id, data).then(
                (response) => {
                    props.getGames(page);
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
            GamesService.create(data).then(
                (response) => {
                    props.getGames(page);
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
            image: '',
            categoryId: '',
            game_url: '',
            description: '',
            meta_title: '',
            meta_keywords: '',
            meta_description: '',
            status: ''
        });
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-plus"></i> Add/Edit Game</h5>
                        <button type="button" className="btn-close" onClick={()=>props.handleModal(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div class="modal-body">
                            
                            {/* title Field */}
                            <div>
                                <label class="col-form-label">Title *</label>
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

                            {/* category Field */}
                            <div>
                                <label class="col-form-label">Category *</label>
                                <select className="form-control" name="categoryId" 
                                    {...register('categoryId', {
                                        required: 'Category is required'
                                    })}
                                    >
                                    <option value="">--Please choose an option--</option>
                                    {props.categories && props.categories.map((cat, index) => (
                                    <option value={ cat.id } key={index}>{ cat.title }</option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <span className="error-message">
                                        {errors.categoryId.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* game url Field */}
                            <div>
                                <label class="col-form-label">Game URL *</label>
                                <input
                                    className="form-control"
                                    type="url"
                                    name="game_url"
                                    {...register('game_url', {
                                        required: 'Game URL is required'
                                    })}
                                />
                                {errors.game_url && (
                                    <span className="error-message">
                                        {errors.game_url.message}
                                    </span>
                                )}
                            </div>

                            {/* image Field */}
                            <div>
                                <label class="col-form-label">Image</label>
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

                            {/* description Field */}
                            <div>
                                <label class="col-form-label">Description *</label>
                                <Controller
                                    name="description" // This will be the key in your form data
                                    control={control}
                                    // defaultValue="" // Initial value for the editor
                                    render={({ field }) => (
                                    <ReactQuill
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur} // Important for validation
                                    />
                                    )}
                                />
                                {/* <textarea
                                    className="form-control"
                                    name="description"
                                    {...register('description', {
                                        required: 'Description is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Description must be at least 2 characters long'
                                        }
                                    })}
                                /> */}
                                {errors.description && (
                                    <span className="error-message">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>

                            <h5 class="modal-title mt-4">For SEO</h5>
                            {/* meta_title Field */}
                            <div>
                                <label class="col-form-label">Meta Title</label>
                                <textarea
                                    className="form-control"
                                    name="meta_title"
                                    {...register('meta_title')}
                                />
                                {errors.meta_title && (
                                    <span className="error-message">
                                        {errors.meta_title.message}
                                    </span>
                                )}
                            </div>

                            {/* meta_keywords Field */}
                            <div>
                                <label class="col-form-label">Meta Keywords</label>
                                <textarea
                                    className="form-control"
                                    name="meta_keywords"
                                    {...register('meta_keywords')}
                                />
                                {errors.meta_keywords && (
                                    <span className="error-message">
                                        {errors.meta_keywords.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* meta_description Field */}
                            <div>
                                <label class="col-form-label">Meta Description</label>
                                <textarea
                                    className="form-control"
                                    name="meta_description"
                                    {...register('meta_description')}
                                />
                                {errors.meta_description && (
                                    <span className="error-message">
                                        {errors.meta_description.message}
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
