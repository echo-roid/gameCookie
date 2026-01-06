import { useState, useEffect } from 'react';

import DashboardService from "../../../services/dashboard.service";
import UserService from "../../../services/user.service";
import { Toast } from '../../../components/Toast.jsx';
import Swal from 'sweetalert2'

export function AdminDashboard() {
  const [data, setData] = useState(undefined);

  useEffect(() => {
      getData();
  }, []);

  const getData = (page) => {
      DashboardService.countAll().then(
          (response) => {
              setData(response.data);
          },
          error => {
              console.log("error", error)
          }
      );
  };

  const cacheClear = () => {
    Swal.fire({
        title: "Do you want to Clear Cache?",
        showCancelButton: true,
        confirmButtonText: "Yes, Clear",
    }).then((result) => {
        if (result.isConfirmed) {
            UserService.flushCache().then(
              (response) => {
                  Toast('success', response?.data.message);
              },
              error => {
                  console.log("error", error)
              }
            );
        }
    });
  };
    
	return (
		<>
      <div>
				<div className="stats-grid">
					<StatCard icon="gamepad" value={data?.gamesCount} label="Total Games" />
					<StatCard icon="users" value={data?.usersCount} label="Active Users" />
					<StatCard icon="eye" value={data?.herosliderCount} label="Active Home Sliders" />
					<StatCard icon="play" value={data?.hometrendingCount} label="Active Trending Games" />


          <div className="stat-card" onClick={()=>cacheClear()}>
            <div className="stat-value">Clear Cache</div>
          </div>
          
				</div>
			</div>
    </>
	);
}


// StatCard Component
const StatCard = ({ icon, value, label }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);