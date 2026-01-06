
import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { useAuth } from "../contexts/AuthContext";

export function AdminSidebar(props) {
	const { logout } = useAuth();
    const { url } = useLocation();
	const activeSidebar = props.adminActiveSidebar;

    useEffect(() => {
        activeSegment();
        props.currentSegment();
        props.setIsAdminSidebar(false);
    }, [url]);

    const activeSegment = () => {
        const pathname = window.location.pathname;
        const pathnameArray = pathname.split("/");
        if(pathnameArray[2]){
            props.setAdminActiveSidebar(pathnameArray[2]);
        } else {
            props.setAdminActiveSidebar('dashboard');
        }
    };

    return (
        <>
        <div className={`sidebar ${props.isAdminSidebar ? 'mobile-open' : ''}`}>
            <div className="sidebar-brand">
            <h4><i className="fas fa-cookie-bite"></i> GamesCookie</h4>
            <span>Admin Panel</span>
            </div>
            <ul className="sidebar-menu">

                {props.adminMenuItems.map(item => (
                    <li key={item.id}>
                    <a 
                        className={activeSidebar === item.id ? 'active' : ''}
                        href={`${import.meta.env.VITE_BASE_URL}/${item.url}`}
                    >
                        <i className={`fas fa-${item.icon}`}></i> {item.label}
                    </a>
                    </li>
                ))}

                <li><a href="/"><i class="fas fa-globe"></i> View Site</a></li>
                <li><a onClick={() => logout()}><i className="fas fa-sign-out"></i> Logout</a></li>
            </ul>
        </div>
        </>
	);
}