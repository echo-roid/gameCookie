import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import UserService from "../../../services/user.service";
import { Pagination, SerialNumber } from "../../../components/Pagination.jsx";

export function AdminUsers() {
    const { url, query } = useLocation();
    const [data, setData] = useState(undefined);

    let page = 1;
    let role = 'user';
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


	return (
		<>
            <div className="content-card">
                <h5><i className="fas fa-users"></i> User Management</h5>
                <div className="table-wrapper">
                    <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            {/* <th>Status</th>
                            <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.content && data.content.map((user, index) => (
                        <tr key={user.id}>
                            <td scope="row">{SerialNumber(index, data.currentPage, data.limit)}</td>
                            <td>
                                {user.image &&
                                    <img width="100" height="100" src={`${import.meta.env.VITE_API}/${user.image}`}/>
                                }
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            {/* <td><span className={`badge badge-${user.status === 'Active' ? 'success' : 'danger'}`}>{user.status}</span></td>
                            <td>
                                <button className="btn-admin btn-primary-admin btn-icon"><i className="fas fa-eye"></i></button>
                                <button className={`btn-admin ${user.status === 'Active' ? 'btn-danger-admin' : 'btn-success-admin'} btn-icon`}>
                                    <i className={`fas fa-${user.status === 'Active' ? 'ban' : 'check'}`}></i>
                                </button>
                            </td> */}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {data?.totalPages>1 &&
                <Pagination
                    route='users'
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    />
                }
            </div>
        
        </>
	);
}



