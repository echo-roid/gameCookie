import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useForm } from 'react-hook-form';

import HomeTrendingService from "../../../services/hometrending.service";
import GamesService from "../../../services/games.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";
import { Toast } from '../../../components/Toast.jsx';
import Swal from 'sweetalert2';

export function AdminHomeTrendingGames(props) {
    const { url, query } = useLocation();
    const [data, setData] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [gamesData, setGamesData] = useState(undefined);


    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(undefined);

    let page = 1;

    useEffect(() => {
        
        if(query?.page) {
            page = parseInt(query.page);
        }

        getData(page);
        getGames();
    }, [url]);

    const getData = (page) => {

        HomeTrendingService.findAll(page).then(
            (response) => {
                setData(response.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const getGames = () => {
        GamesService.findAllActive().then(
            (response) => {
                setGamesData(response.data.data);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    };

    const editItem = (data) => {
        setIsEdit(true);
        // setEditData({ title: data.title });
        setEditData(data);
        handleModal(true);
    };

    const deleteItem = (data) => {
        Swal.fire({
            title: "Do you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItemConfirm(data);
            }
        });
        
    };
    
    const deleteItemConfirm = async (data) => {
        HomeTrendingService.delete(data.id).then(
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
                    <h5><i className="fas fa-th-large"></i> Trending Games Management</h5>
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
                            <th>Tag</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content && data.content.map((item, index) => (
                        <tr key={index}>
                            <td>{SerialNumber(index, data.currentPage, data.limit)}</td>
                            <td>
                                {item.game.image &&
                                    <img width="100" height="100" src={`${import.meta.env.VITE_API}/${item.game.image}`}/>
                                }
                            </td>
                            <td>{item.game.title}</td>
                            <td>{item.tag}</td>
                            <td><span className={`badge badge-${item.status ? 'success' : 'warning'}`}>{item.status ? 'Active' : 'In-active'}</span></td>
                            
                            <td>
                                <button className="btn-admin btn-primary-admin btn-icon" onClick={()=>editItem(item)}><i className="fas fa-edit"></i></button>
                                <button className="btn-admin btn-danger-admin btn-icon" onClick={()=>deleteItem(item)}><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                
                {data?.totalPages>1 &&
                <Pagination
                    route='trending'
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
                gamesData={gamesData}
                page={page}
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
            tag: '',
            gameId: '',
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
            tag: props.editData?.tag || '',
            gameId: props.editData?.gameId || '',
            status: props.editData?.status ? '1' : '0',
        });
    };
        
    const submitForm = async (data) => {
        if(props.isEdit){
            HomeTrendingService.update(props.editData?.id, data).then(
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
            HomeTrendingService.create(data).then(
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
            gameId: '',
            tag: '',
            status: ''
        });
    };

	return (
		<>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h5 className="modal-title"><i className="fas fa-plus"></i> Add/Edit</h5>
                        <button type="button" className="btn-close" onClick={()=>props.handleModal(false)}>×</button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div class="modal-body">
                            
                            {/* Games Field */}
                            <div>
                                <label class="col-form-label">Games:</label>
                                <select className="form-control" {...register("gameId", { required: "Game is required" })}>
                                    <option value="">--Please select game--</option>
                                    {props.gamesData && props.gamesData.map((game, index) => (
                                    <option key={index} value={game.id}>{game.title}</option>
                                    ))}
                                </select>
                                {errors.gameId && (
                                    <span className="error-message">
                                        {errors.gameId.message}
                                    </span>
                                )}
                            </div>

                            {/* Tag Field */}
                            <div>
                                <label class="col-form-label">Tag:</label>
                                <select className="form-control" {...register("tag", { required: "Tag is required" })}>
                                    <option value="">--Please select tag--</option>
                                    <option value="Hot">Hot</option>
                                    <option value="New">New</option>
                                    <option value="Top">Top</option>
                                    <option value="Pro">Pro</option>
                                </select>
                                {errors.tag && (
                                    <span className="error-message">
                                        {errors.tag.message}
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



