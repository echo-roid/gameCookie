import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'preact-iso';

import GamesService from "../../services/games.service";
import FavoriteService from "../../services/favorite.service";
import CategoryService from "../../services/category.service";

import { Ads2, Ads3, Ads4 } from '../../components/Ads.jsx';
import { GoogleAd, GoogleAdResponsive } from '../../components/GoogleAd.jsx';
import Seo from '../../components/Seo.jsx';

import Helper from "../../helper";
import { Toast } from '../../components/Toast.jsx';
import { ReviewsSection } from '../../components/ReviewsSection.jsx';

import AuthService from "../../services/auth.service";
import DOMPurify from 'dompurify';
import { useAuth } from "../../contexts/AuthContext";


export function GameDetails(props) {
	const { url } = useLocation();
	const id = props.id;
	const elementRef = useRef(null);
	const { openLogin, isAuthenticated } = useAuth();

	const [isGamePlayed, setIsGamePlayed] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isIphoneFullscreen, setIsIphoneFullscreen] = useState(false);


	const [gameData, setGameData] = useState(undefined);

	const [reviewsAvg, setReviewsAvg] = useState(0);
	const [reviewsTotal, setReviewsTotal] = useState(0);

	const [relatedGamesData, setRelatedGamesData] = useState(undefined);
	const [myFavoriteData, setMyFavoriteData] = useState(undefined);
	
	const [categoryActiveTab, setCategoryActiveTab] = useState('ALL');
	const [categoryData, setCategoryData] = useState(undefined);

	// Detect iPhone
  	const isIphone = /iPhone|iPod/.test(navigator.userAgent);

  	const enterFullscreen = () => {
		if (isIphone) {
		// CSS fallback fullscreen for iPhone
		setIsIphoneFullscreen(true);
		return;
		}

		if (elementRef.current) {
		if (elementRef.current.requestFullscreen) {
			elementRef.current.requestFullscreen();
		} else if (elementRef.current.mozRequestFullScreen) {
			elementRef.current.mozRequestFullScreen();
		} else if (elementRef.current.webkitRequestFullscreen) {
			elementRef.current.webkitRequestFullscreen();
		} else if (elementRef.current.msRequestFullscreen) {
			elementRef.current.msRequestFullscreen();
		}
		}
	};

	const exitFullscreen = () => {
		setIsGamePlayed(false);

		if (isIphone) {
		setIsIphoneFullscreen(false);
		return;
		}

		if (document.fullscreenElement) {
		document.exitFullscreen();
		}
	};

	useEffect(() => {
		const handleFullscreenChange = () => {
		setIsFullscreen(Boolean(document.fullscreenElement));
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
		document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);



	//GameWithAds
	const [showAdOverlay, setShowAdOverlay] = useState(false);
	const [adKey, setAdKey] = useState(0); // 🔑 forces re-mount

	useEffect(() => {
		const handleMessage = (event) => {
		// if (event.origin !== "https://games.gamescookie.com") return;

		if (event.data?.type === "GAME_COMPLETED") {
			console.log("🎮 GAME COMPLETED");
			setAdKey(prev => prev + 1); // force new ad
			setShowAdOverlay(true);
		}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	useEffect(() => {
		if (!showAdOverlay) return;

		// Load AdSense AFTER ins is mounted
		try {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {
		console.error("AdSense error", e);
		}
	}, [showAdOverlay, adKey]);


	const overlayStyle = {
		position: "fixed",
		inset: 0,
		background: "rgba(0,0,0,0.75)",
		zIndex: 9999,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};

	const adBoxStyle = {
		background: "#fff",
		padding: 16,
		maxWidth: 400,
		width: "100%",
		textAlign: "center",
	};




	useEffect(() => {
		getGames();
		getFavorite();
		getCategories();
		setIsGamePlayed(false);
	}, [url]);

	const getGames = async () => {
		await GamesService.findOne(id).then(
			(response) => {
				setGameData(response.data.data);
				setCategoryActiveTab(response.data.data.category.title);
        		setIsFavorite(response.data.data.isFavourite);
				setRelatedGamesData(response.data.relatedGames);

				setReviewsAvg(response.data.gameAvg);
				setReviewsTotal(response.data.totalReviews);
				
			},
			error => {
				console.log("error", error)
			}
		);
	};

    
    const playGame = () => {
        enterFullscreen();
        // handleClickInsideIframe();
        setIsGamePlayed(true);
    };


	const [isFavorite, setIsFavorite] = useState(false);

	let loginCheckGameInterval = null;
	const handleFavoriteClick = async () => {

		if (!checkAuth()) {
			openLogin();
			// If interval already running, don't create new one
			if (loginCheckGameInterval) return;

			loginCheckGameInterval = setInterval(() => {
				const user = checkAuth();
				if (user) {
					clearInterval(loginCheckGameInterval);
					loginCheckGameInterval = null;

					// Now user is authenticated — safely call again
					handleFavoriteClick();
				}
			}, 3000);
			return;
		}

		const data = { gameId: gameData.id }

		// Authenticated → Proceed with API call
		try {
			const data = { gameId: gameData.id };
			
			const response = await FavoriteService.favorite(data);
			setIsFavorite(response.data.favorite);
			Toast('success', response.data.message);
		
		} catch (error) {
			console.log("error", error);
			Toast("error", error);
		}
	};

	const checkAuth = () => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    }

    let loginCheckInterval = null;
	const handleRelatedFavoriteClick = async (gameData) => {
		if (!checkAuth()) {
			openLogin();
			// If interval already running, don't create new one
			if (loginCheckInterval) return;

			loginCheckInterval = setInterval(() => {
				const user = checkAuth();
				if (user) {
					clearInterval(loginCheckInterval);
					loginCheckInterval = null;

					// Now user is authenticated — safely call again
					handleRelatedFavoriteClick(gameData);
				}
			}, 3000);
			return;
		}

		// Authenticated → Proceed with API call
		try {
			const data = { gameId: gameData.id };
			
			const response = await FavoriteService.favorite(data);
			getFavorite();
			Toast("success", response.data.message);
		
		} catch (error) {
			console.log("error", error);
			Toast("error", error);
		}

	};

	const getFavorite = async () => {
		await FavoriteService.myFavoriteFront().then(
			(response) => {
				setMyFavoriteData(response.data.data);
			},
			error => {
				console.log("error", error)
			}
		);
	};

	const checkFavorite = (game) => {
		let exists = 'regular';
		if(myFavoriteData){
			const checking = myFavoriteData.includes(game.id);
			if(checking){
				exists = 'solid';
			}
		}

		return exists;
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

	return (
		<>

		{gameData?.id && (
		<div className="container details mb-2">

			<Seo
			title={gameData.meta_title}
			description={gameData.meta_description}
			keywords={gameData.meta_keywords}
			image={`${import.meta.env.VITE_API}/${gameData.image}`}
			canonical={`${import.meta.env.VITE_BASE_URL}/game/${gameData.id}/${gameData.slug}`}
			ogType={gameData.category.title}
			/>


			{/* Game Categories */}
            <div className="container" id="categories">
                <div className="categories-grid">
                    <a className={`category-card ${categoryActiveTab=='ALL'?'active':'active'}`} href="/games?q=ALL">
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_BASE_URL}/images/allgame.png`} alt="ALL GAMES icon" class="category-img" /> */}
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <h6>ALL GAMES</h6>
                    </a>
                    
                    {categoryData && categoryData.map((cat, idx) => (
                    <a key={idx} className={`category-card ${categoryActiveTab==cat.title?'active':'active'}`} href={`/games?q=${cat.title}`}>
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_API}/${cat.image}`} alt={cat.title} class="category-img" /> */}
                            <i class={`fas fa-${cat.icon}`}></i>
                        </div>
                        <h6>{cat.title}</h6>
                    </a>
                    ))}
                </div>
            </div>

			{/* Ad Banner Top */}
			{/* <Ads2 
				class="mb-4"
				/> */}

			{/* Game Hero Section */}
			<div
				className={`game-hero relative bg-black ${
					isIphoneFullscreen ? "iphone-fullscreen" : ""
				}`}
				ref={elementRef}>
				{!isGamePlayed &&
				<div onClick={() => playGame()} style="cursor: pointer;">
				<img 
					src={`${import.meta.env.VITE_API}/${gameData.image}`}
					alt={gameData.title}
					className="game-hero-image"
				/>
				<div className="game-hero-overlay">
					<span className="game-category">
					{gameData.category.title}
					</span>
					<h1 className="game-title">{gameData.title}</h1>
					
					{/* <div className="game-meta">
						<div className="meta-item">
							<i className="fas fa-calendar"></i>
							<span>Added: {Helper.dateFormat(gameData.createdAt)}</span>
						</div>
					</div> */}
					
					<div>
						<button className="play-button" onClick={() => playGame()}>
							<i className="fas fa-play"></i>
							Play Now
						</button>
					</div>
				</div>
				</div>
				}

				{isGamePlayed &&
				<>
				<iframe
					src={gameData.game_url}
					// src="http://localhost:8000"
					title={gameData.title}
					width="100%" 
					height="100%"
					sandbox="allow-scripts allow-same-origin"
					/>


				{/* AD OVERLAY */}
				{showAdOverlay && (
					<div style={overlayStyle}>
					<div style={adBoxStyle}>
						<ins
						key={adKey} // 🔑 VERY IMPORTANT
						className="adsbygoogle"
						style={{ display: "block" }}
						data-ad-client="ca-pub-2206181847362717"
						data-ad-slot="5562456394"
						data-ad-format="auto"
						data-full-width-responsive="true"
						/>

						<button onClick={() => setShowAdOverlay(false)}>
						Close
						</button>
					</div>
					</div>
				)}

				</>
				}

				{/* EXIT BUTTON inside fullscreen */}
				{(isFullscreen || isIphoneFullscreen) && (
					<button
					onClick={exitFullscreen}
					className="exit-btn px-4 py-2 rounded"
					>
					X
					</button>
				)}

			</div>

			<div className="row">
			<div className="col-lg-9">

				<h2 className="game-title h2">{gameData.title}</h2>

				{/* Action Buttons */}
				<div className="action-buttons">
				
        		<button 
					className={`action-btn ${isFavorite ? 'active' : ''}`}
					onClick={handleFavoriteClick}
				>
					<i className="fas fa-heart"></i> {isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}
				</button>

				{isGamePlayed &&
				<button className="action-btn" onClick={() => enterFullscreen()} >
					<i className="fas fa-expand"></i> Fullscreen
				</button>
				}
				</div>

				{/* Game Description */}
				<div className="content-section">
				<h3 className="section-title mt-0">
					<i className="fas fa-info-circle"></i> About This Game
				</h3>
				<p className="game-description m-0"
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(gameData.description),
					}}
				/>
				</div>

				<GoogleAdResponsive slot="9464002959" class="mt-2 mb-4"/>

				{/* Game Reviews */}
				<ReviewsSection
				gameId={id}
				gameData={gameData}
				/>
				
			</div>

			<div className="col-lg-3">
				{/* Side Ad */}
				{/* <Ads3 /> */}
				<GoogleAd slot="7240578228" width="330" height="600" />
			</div>
			</div>

			{/* Related Games */}
			{relatedGamesData?.length > 0 &&
			<div className="content-section rtx rel mb-0">
			<h3 className="section-title mt-0 mb-4">
				<i className="fas fa-fire"></i> More Like This
			</h3>
			<div className="row p-1 mb-0">
				{relatedGamesData.map((relatedGame, index) => (
				<div key={index} className="col-6 col-xl-3 col-lg-4 col-md-6 col-sm-6 p-2">
					<div className="game-card">
						<a href={`${import.meta.env.VITE_BASE_URL}/game/${relatedGame.id}/${relatedGame.slug}`} class="card-anc">
							<img 
							src={`${import.meta.env.VITE_API}/${relatedGame.image}`}
							alt={relatedGame.title}
							className="game-card-img"
							/>
						</a>

						<div className="game-card-body">
							{relatedGame?.category && <div className="game-card-genre">{relatedGame.category.title}</div>}
							
							<button class={`favorite-btn `} onClick={()=>handleRelatedFavoriteClick(relatedGame)}>
								<i class={`fa-${checkFavorite(relatedGame)} fa-heart`}></i>
							</button>
							

							<h5 className="game-card-title">{relatedGame.title}</h5>
							<a className="play-btn" href={`${import.meta.env.VITE_BASE_URL}/game/${relatedGame.id}/${relatedGame.slug}`}>
								<i className="fas fa-play"></i> Play Now
							</a>
						</div>

					</div>
					
				</div>
				))}
			</div>
			</div>
			}

		</div>
		)}


        </>
	);
}
