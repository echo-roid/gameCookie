import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'preact-iso';

import { LoginModal } from './modals/Login';
import PWAInstall from './PWAInstall';

import CategoryService from "../services/category.service";
import MetatagsService from "../services/metatags.service";
import GamesService from "../services/games.service";
import { useAuth } from "../contexts/AuthContext";
import Seo from './Seo.jsx';

export function Header(props) {
	const { url, query } = useLocation();
	const segment1 = location.pathname.split("/")[1];

	const { openLogin, logout, isAuthenticated, user, isAdmin, getUser } = useAuth();

	const searchRef = useRef(null);

	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResultsVisible, setSearchResultsVisible] = useState(false);

	//...
	const [showMobileSidebar, setShowMobileSidebar] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);

	const [categoryData, setCategoryData] = useState(undefined);
	const [gameData, setGameData] = useState(undefined);
	const [metatagsData, setMetatagsData] = useState(undefined);

	const logoUrl = import.meta.env.VITE_BASE_URL + '/images/logo.png';


	useEffect(() => {
        props.currentSegment();
		setSearchResultsVisible(false);
		setMobileSearchOpen(false);
		setShowUserDropdown(false);
		setSearchTerm('');
    }, [url]);

	useEffect(() => {
        getUser();
    }, [!isAuthenticated]);

	useEffect(() => {
        props.getUser();
    }, [isAuthenticated]);

	useEffect(() => {
		getCategories();
		getGames();
		getMetatags();

		const handleClickOutside = (e) => {
		if (searchRef.current && !searchRef.current.contains(e.target)) {
			setSearchResultsVisible(false);
			setMobileSearchOpen(false);
		}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearch = (value) => {
		setSearchTerm(value);
		setSearchResultsVisible(value.trim().length > 0);
	};


	//Search filter 
	//includes  //startsWith
	const filteredGames = gameData?.length && gameData.filter(game =>
		game.title.toLowerCase().startsWith(searchTerm.toLowerCase())
	);

	const getMetatags = async () => {
		await MetatagsService.findAllActive().then(
			(response) => {
				setMetatagsData(response.data.data);
			},
			error => {
				console.log("error", error)
			}
		);
	};

	const getCategories = async () => {
		await CategoryService.findAllActive().then(
			(response) => {
				setCategoryData(response.data.data);
			},
			error => {
				console.log("error", error)
			}
		);
	};

	const getGames = async () => {
		await GamesService.findAllActive().then(
			(response) => {
				setGameData(response.data.data);
			},
			error => {
				console.log("error", error)
			}
		);
	};

	const reloadHome = () => {
		window.location.href = '/';
	};



	function scrollToElement(id) {
		const element = document.getElementById(id);
		if (element) {
			const targetPosition = element.getBoundingClientRect().top + window.scrollY - 90;
			window.scrollTo({ top: targetPosition, behavior: "smooth" });
		}
		
		// if (element) {
		// 	element.scrollIntoView({ behavior: 'smooth' });
		// }
	}
	
	const sidebarSection = () => {
		setShowMobileSidebar(false);
		scrollToElement('scroolHere');
	};




	
	return (
		<>
			
			{metatagsData && metatagsData.map((metatag, idx) => {
				if(metatag.type === 'home' && segment1 === ''){
					return (
						<Seo
                			key={idx}
							title={metatag.title}
							description={metatag.description}
							keywords={metatag.keywords}
						/>
					)
				}
				else if(metatag.type === segment1){
					return (
						<Seo
                			key={idx}
							title={metatag.title}
							description={metatag.description}
							keywords={metatag.keywords}
						/>
					)
				}
				else {
					return null;
				}
			})}

			


			<nav className="navbar-custom sticky-top">
				<div className="container-fluid py-2">
					<div className="d-flex align-items-center justify-content-between w-100">
						{/* Left Side - Mobile Menu + Logo */}
						<div className="d-flex align-items-center gap-3">
							{/* Logo */}
							<a href="/" className="navbar-brand-custom text-decoration-none" onClick={() => reloadHome()}>
								<img 
								src={logoUrl} 
								alt="GamesCookie" 
								style={{height: '60px'}}
								/>
							</a>
						</div>

						{/* Right Side - Search + User Profile */}
						<div className="header-right">
							{/* Search Bar */}
							<button type="button" className="mobile-search-toggle p-0 m-0">
								<PWAInstall />
							</button>

							<button className="mobile-search-toggle m-0" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
								<i className="fas fa-search"></i>
							</button>

							<div className={`search-container ${mobileSearchOpen ? 'mobile-open' : ''}`} ref={searchRef}>
								<input 
									type="text" 
									className="search-input" 
									placeholder="SEARCH GAMES"
									value={searchTerm}
									onChange={(e) => handleSearch(e.target.value)}
								/>
								<i className="fas fa-search search-icon"></i>
								
								{searchResultsVisible && (
									<div className="search-results">
									{filteredGames.length > 0 ? (
										filteredGames.map((game, idx) => (
										<a 
											key={idx} 
											className="search-result-item"
											href={`${import.meta.env.VITE_BASE_URL}/game/${game.id}/${game.slug}`}
										>
											<img src={`${import.meta.env.VITE_API}/${game.image}`} alt={game.title} className="search-result-img" />
											<div className="search-result-info">
												<h6>{game.title}</h6>
												<p>{game.category.title}</p>
											</div>
										</a>
										))
									) : (
										<div className="no-results">
										<i className="fas fa-search"></i>
										<p>No games found</p>
										</div>
									)}
									</div>
								)}
							</div>

							


							{/* <!-- Logged Out State --> */}
							{!isAuthenticated &&
							<button className="btn-login" onClick={()=>openLogin()}>
								<i className="fas fa-user"></i> Login
							</button>
							}

							{/* User Profile Dropdown */}
							{isAuthenticated &&
							<UserHeaderDropdown />
							}

							{/* Mobile Menu Button */}
							<button 
								className="mobile-menu-btn d-lg-none"
								onClick={() => setShowMobileSidebar(true)}
								>
								<i className="fas fa-bars"></i>
							</button>

						</div>
					</div>
				</div>
			</nav>


			{/* Click outside to close dropdown */}
			{showUserDropdown && (
				<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 999
				}}
				onClick={() => setShowUserDropdown(false)}
				></div>
			)}


			{/* Mobile Sidebar */}
			{showMobileSidebar && (
				<>
				<div 
					className="sidebar-overlay"
					onClick={() => setShowMobileSidebar(false)}
				></div>
				
				<div className="mobile-sidebar">
					{/* Sidebar Header */}
					<div className="sidebar-header">
					<img 
						src={logoUrl} 
						alt="GamesCookie" 
						style={{height: '75px'}}
						onClick={() => reloadHome()}
					/>
					<button 
						className="sidebar-close-btn"
						onClick={() => setShowMobileSidebar(false)}
					>
						<i className="fas fa-times"></i>
					</button>
					</div>


					{/* Categories Section */}
					<div className="sidebar-section">
						
						{user &&
						<>
							<div class="admin-profile mb-2">
								<div class="user-avatar">
									{user.image ? (
									<img src={`${import.meta.env.VITE_BASE_URL}/avatars/${user?.image}`} />
									) : (
									user.initial
									)}
								</div>
								<div class="admin-info">
									<div className="fw-bold">{user.name}</div>
									<div className="small truncated-text opacity-75">{user.email}</div>
								</div>
							</div>


							{isAdmin &&
							<a className="sidebar-category-item" href="/admin" onClick={() => setShowMobileSidebar(false)}>
								<div className="category-info">
									<i className="fas fa-dashboard"></i>
									<span>Admin Dashboard</span>
								</div>
							</a>
							}

							<a className="sidebar-category-item" href="/profile" onClick={() => setShowMobileSidebar(false)}>
								<div className="category-info">
									<i class="fas fa-user"></i>
									<span>My Profile</span>
								</div>
							</a>

							<a className="sidebar-category-item" onClick={()=>logout()}>
								<div className="category-info">
									<i className="fas fa-sign-out-alt"></i>
									<span>Logout</span>
								</div>
							</a>
						</>
						}

						{/* <!-- Logged Out State --> */}
						{!isAuthenticated &&
						<a className="sidebar-category-item" onClick={()=>openLogin()}>
							<div className="category-info">
								<i className="fas fa-user"></i>
								<span>Login</span>
							</div>
						</a>
						}

						


						<div className="sidebar-section-title">Categories</div>
						
						<a className="sidebar-category-item" href="/games?q=ALL" onClick={() => sidebarSection()}>
							<div className="category-info">
								{/* <img src={`${import.meta.env.VITE_BASE_URL}/images/allgame.png`} alt="ALL GAMES icon" class="category-header-img" /> */}
								<i class="fas fa-gamepad"></i>
								<span>All Games</span>
							</div>
						</a>

						{categoryData && categoryData.map((category, idx) => (
							<a 
							key={idx}
							className="sidebar-category-item"
							href={`/games?q=${category.title}`}
							onClick={() => sidebarSection()}
							>
							<div className="category-info">
								{/* <img src={`${import.meta.env.VITE_API}/${category.image}`} alt={category.title} class="category-header-img" /> */}
								<i class={`fas fa-${category.icon}`}></i>
								<span>{category.title}</span>
							</div>
							</a>
						))}


						
						
					</div>
				</div>
				</>
			)}



			{/* <!-- Modal --> */}
			{/* <!-- Login Modal --> */}
			{/* {isLoginModalOpen &&
			<LoginModal
				isLoginModalOpen={isLoginModalOpen}
				/>
			} */}

			<LoginModal
				/>

		</>
	);
}







function UserHeaderDropdown(props) {
	const { logout, isAdmin, user } = useAuth();

	const [showUserDropdown, setShowUserDropdown] = useState(false);

	const { url } = useLocation();

	useEffect(() => {
        setShowUserDropdown(false);
    }, [url]);


	useEffect(() => {
		const handleScroll = () => {
			setShowUserDropdown(false);
		};

		window.addEventListener("scroll", handleScroll);

		// Cleanup event listener when component unmounts
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showUserDropdown]);
	
	return (
		<>
			<div className="position-relative respo">
				<button
				className="user-profile-btn"
				onClick={() => setShowUserDropdown(!showUserDropdown)}
				>
				<div className="user-avatar">
					{user.image ? (
					<img src={`${import.meta.env.VITE_BASE_URL}/avatars/${user?.image}`} />
					) : (
					user.initial
					)}
				</div>
				{/* <span className="d-none d-md-inline fw-semibold">
					{user.name}
				</span> */}
				<i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
				</button>

				{showUserDropdown && (
				<div className="dropdown-menu-custom">
					<div className="dropdown-header">
						<div className="fw-bold">{user.name}</div>
						<div className="small opacity-75">{user.email}</div>
					</div>
					
					{isAdmin && (
					<a className="dropdown-item-custom" href="/admin">
						<i className="fas fa-dashboard"></i>
						<span>Admin Dashboard</span>
					</a>
					)}

					<a className="dropdown-item-custom" href="/profile">
						<i className="fas fa-user"></i>
						<span>My Profile</span>
					</a>
					
					
					{/* <button className="dropdown-item-custom" onClick={() => window.location.href = '#settings'}>
						<i className="fas fa-cog"></i>
						<span>Settings</span>
					</button> */}
					
					<div className="dropdown-divider"></div>
					
					<button className="dropdown-item-custom" onClick={()=>logout()}>
						<i className="fas fa-sign-out-alt"></i>
						<span>Logout</span>
					</button>
				</div>
				)}
			</div>
		</>
	);
}