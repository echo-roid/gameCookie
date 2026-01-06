import { render } from 'preact';
import { useState, useEffect } from 'react';
import { useLocation, LocationProvider, Router, Route } from 'preact-iso';

//...
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
//...
import { AdminSidebar } from './components/AdminSidebar.jsx';
import { GoogleAd, GoogleAdResponsive } from './components/GoogleAd.jsx';
import {initGA, trackPageView} from './components/Analytics.jsx';


import { Home } from './pages/Home/index.jsx';
import { GamesData } from './pages/Game/index.jsx';
import { GameDetails } from './pages/Game/details.jsx';
import { GameDetailsReview } from './pages/Game/reviews.jsx';
import { Privacy } from './pages/Privacy/index.jsx';
import { Terms } from './pages/Terms/index.jsx';
import { About } from './pages/About/index.jsx';
import { NotFound } from './pages/_404.jsx';


//...........User Pages
import { Profile } from './pages/Profile/index.jsx';

//...........Admin Pages
import { AdminDashboard } from './pages/Admin/Dashboard/index.jsx';
import { AdminUsers } from './pages/Admin/Users/index.jsx';
import { AdminRoleUsers } from './pages/Admin/AdminUsers/index.jsx';
import { AdminCategories } from './pages/Admin/Categories/index.jsx';
import { AdminGames } from './pages/Admin/Games/index.jsx';
import { AdminHomeSlider } from './pages/Admin/HomeSlider/index.jsx';
import { AdminHomeTrendingGames } from './pages/Admin/HomeTrendingGames/index.jsx';
import { AdminMetatags } from './pages/Admin/Metatags/index.jsx';


import Seo from './components/Seo.jsx';
import AuthService from "./services/auth.service";
import './style.css';

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { registerSW } from 'virtual:pwa-register';



// Register the service worker and handle updates
const updateSW = registerSW({
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
  onNeedRefresh() {
    // Prompt the user to reload the page when a new version is available
    if (window.confirm("New content available! Reload to update?")) {
      updateSW(true); // This function forces the update and reloads the page
    }
  },
  onRegisteredSW(swScriptUrl) {
    console.log('Service Worker registered:', swScriptUrl);
  },
})
// if ('serviceWorker' in navigator) {
//   registerSW();
// }


const PrivateRoute = ({ component: Component, path, ...rest }) => {
	const user = AuthService.getCurrentUser();
	useEffect(() => {
		if (!user) {
			window.location.href = "/";
		}
	}, [user]);

	return user ? <Component {...rest} /> : null;
};




export function App() {
	
	const { url } = useLocation();

	const [isAdminBoard, setIsAdminBoard] = useState(false);
	const [isAdminSidebar, setIsAdminSidebar] = useState(false);
	const [currentUser, setCurrentUser] = useState(undefined);
	const [isLoggedIn, setIsLoggedIn] = useState(false);


	
	useEffect(() => {
        getUser();
		currentSegment();
    }, [isLoggedIn]);

	const currentSegment = () => {
		const pathname = window.location.pathname;
		const pathnameArray = pathname.split("/");
		if(pathnameArray[1] && pathnameArray[1] == 'admin'){
			setIsAdminBoard(true);
		} else {
			setIsAdminBoard(false);
		}
	};

	const getUser = () => {
        const user = AuthService.getCurrentUser();
		if (user) {
			setCurrentUser(user);
			setIsLoggedIn(true);
		}
    };

	

	const [adminActiveSidebar, setAdminActiveSidebar] = useState('dashboard');
	const adminMenuItems = [
		{ id: 'dashboard', icon: 'dashboard', label: 'Dashboard', url: 'admin'},
		{ id: 'admin_users', icon: 'users', label: 'Admin Users', url: 'admin/admin_users' },
		{ id: 'users', icon: 'users', label: 'Users', url: 'admin/users' },
		{ id: 'categories', icon: 'th-large', label: 'Categories', url: 'admin/categories' },
		{ id: 'games', icon: 'gamepad', label: 'Games', url: 'admin/games' },
		{ id: 'slider', icon: 'gamepad', label: 'Home Slider', url: 'admin/slider' },
		{ id: 'trending', icon: 'gamepad', label: 'Home Trending Games', url: 'admin/trending' },
		{ id: 'metatags', icon: 'tasks', label: 'Metatags', url: 'admin/metatags' },
		// { id: 'settings', icon: 'cog', label: 'Settings' },
	];
	const adminSectionTitles = {
		dashboard: 'Dashboard',
		games: 'Manage Games',
		users: 'User Management',
		admin_users: 'Admin User Management',
		categories: 'Categories',
		slider: 'Home Slider',
		trending: 'Home Trending Games',
		metatags: 'Metatags',
		// settings: 'Settings'
	};


	function handleRoute(e) {
		if (window.gtag) {
			window.gtag("config", import.meta.env.VITE_GTAG, {
			page_path: e.url,
			});
		}
	}


	return (
		<AuthProvider>
		<LocationProvider>

			<Seo
				title="GamesCookie – Play Free Online HTML5 Games Instantly"
				description="Play the best free online HTML5 games on GamesCookie. Enjoy action, arcade, puzzle, racing, and adventure games instantly — no downloads required!"
				keywords="free online games, HTML5 games, browser games, play games online, action games, puzzle games, racing games, adventure games, instant play, no download games"
			/>
			
			{/* //.....Admin Routes....... */}
			{(isLoggedIn && currentUser?.role=='admin' && isAdminBoard) &&
			<>
			

				<div id="admin-panel">
					{/* Mobile Overlay */}
    				<div className={`mobile-overlay ${isAdminSidebar ? 'active' : ''}`} onClick={() => setIsAdminSidebar(false)}></div>

					{/* <!-- Admin Sidebar --> */}
					<AdminSidebar
						isAdminSidebar={isAdminSidebar}
						setIsAdminSidebar={setIsAdminSidebar}
						currentSegment={currentSegment}
						adminActiveSidebar={adminActiveSidebar}
						setAdminActiveSidebar={setAdminActiveSidebar}
						adminMenuItems={adminMenuItems}
						/>

					{/* Main Content */}
					<div className="main-content">
						<div className="top-bar">
							<button className="hamburger-menu" onClick={() => setIsAdminSidebar(true)}>
								<i className="fas fa-bars"></i>
							</button>
							<h2>
								<i className={`fas fa-${adminMenuItems.find(m => m.id === adminActiveSidebar)?.icon || 'dashboard'}`}></i> 
            					{adminSectionTitles[adminActiveSidebar]}
							</h2>
							<div className="admin-profile">
								<div className="admin-avatar">
									{currentUser.image ? (
									<img src={`${import.meta.env.VITE_BASE_URL}/avatars/${currentUser?.image}`} />
									) : (
									currentUser.initial
									)}
								</div>
								<div className="admin-info">
									<h6>{currentUser.name}</h6>
									<p>Super Administrator</p>
								</div>
							</div>
						</div>
						
						<Router>
							<Route path="/admin" component={AdminDashboard} />
							<Route path="/admin/admin_users" component={AdminRoleUsers} />
							<Route path="/admin/users" component={AdminUsers} />
							<Route path="/admin/categories" component={AdminCategories} />
							<Route path="/admin/games" component={AdminGames} />
							<Route path="/admin/slider" component={AdminHomeSlider} />
							<Route path="/admin/trending" component={AdminHomeTrendingGames} />
							<Route path="/admin/metatags" component={AdminMetatags} />
						</Router>
					</div>
				</div>
			</>
			}


			{/* game details page */}
			{!isAdminBoard &&
			<>
				
				<Header
					getUser={getUser}
					currentSegment={currentSegment}
					/>

				<main id="main-content" class="container-fluid p-4">
					<Router onChange={handleRoute}>
						<Route path="/" component={Home} />
						<Route path="/games" component={GamesData} />
						<Route path="/game/:id/:slug" component={GameDetails} />
						<Route path="/game/:id/:slug/reviews" component={GameDetailsReview} />
						<Route path="/privacy" component={Privacy} />
						<Route path="/terms" component={Terms} />
						<Route path="/about" component={About} />

						{/* user routes */}
						{/* Use the PrivateRoute for protected pages */}
						<PrivateRoute path="/profile" component={Profile} />


						{/* invalid request/route */}
						<Route default component={NotFound} />
					</Router>

					{/* Advertisement */}
					<GoogleAd slot="2365038958" width="1200" height="100" class={`mt-3 last`}/>
					<GoogleAdResponsive slot="2903938818" class="mt-2 last"/>
					
				</main>
				<Footer />
			</>
			}
		</LocationProvider>
		</AuthProvider>
	);
}

// render(<App />, document.getElementById('app'));

// registerSW({
//   immediate: true,
// });

// const updateSW = registerSW({
//   onOfflineReady() {
//     console.log('offline ready')
//   },
// })

const rootElement = document.getElementById("app");
if (rootElement.hasChildNodes()) {
  render(<App />, rootElement, rootElement.firstElementChild);
} else {
  render(<App />, rootElement);
}