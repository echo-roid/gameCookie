
export function Search(props) {
    return (
        <>
            <ul class="pagination mt-3">
                {(props.currentPage > 1) &&
                    <li class="page-item"><a class="page-link" href={`/admin/users?page=${props.currentPage - 1}`}>Previous</a></li>
                }
                
                <li class="page-item"><a class="page-link" href="javascript:void(0)">{props.currentPage} of {props.totalPages}</a></li>
                
                {(props.currentPage < props.totalPages) &&
                    <li class="page-item"><a class="page-link" href={`/admin/users?page=${props.currentPage + 1}`}>Next</a></li>
                }
            </ul>
        </>
	);
}

export const SerialNumber = (index, currentPage, limit) => {
    return (((currentPage - 1) * limit) + index + 1);
}

