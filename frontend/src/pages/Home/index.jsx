import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'preact-iso';

import { Ads1, Ads2, Ads4 } from '../../components/Ads.jsx';
import { GoogleAd, GoogleAdResponsive } from '../../components/GoogleAd.jsx';

import { Games } from '../../components/Games.jsx';
import Seo from '../../components/Seo.jsx';

//...services
import HomeSliderService from "../../services/homeslider.service";
import HomeTrendingService from "../../services/hometrending.service";
import CategoryService from "../../services/category.service";
import GamesService from "../../services/games.service";
import FavoriteService from "../../services/favorite.service.jsx";

import { Toast } from '../../components/Toast.jsx';
import AuthService from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";


export const Home = () => {
    const { url, query } = useLocation();
    const { openLogin, isAuthenticated, getUserResponse } = useAuth();

    const sliderRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [trendingSlide, setTrendingSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(4);

    const [heroSliderData, setHeroSliderData] = useState(undefined);
    const [trendingGamesData, setTrendingGamesData] = useState(undefined);
    const [categoryData, setCategoryData] = useState(undefined);
    
    const [gamesAllData, setGamesAllData] = useState(undefined);
    const [gamesData, setGamesData] = useState(undefined);

    const [myFavoriteData, setMyFavoriteData] = useState(undefined);
    const [categoryActiveTab, setCategoryActiveTab] = useState('ALL');
    const [isFilter, setIsFilter] = useState('');
    
    let page = 1;

    useEffect(() => {
        // Defer slider initialization
        const initializeSliders = () => {
            requestAnimationFrame(() => {
                getHeroSliders();
                getTrendingGames();
                getCategories();
                getFavorite();
            });
        };
        
        // Give AdSense time to load
        setTimeout(initializeSliders, 100);
    }, []);

    useEffect(() => {
        let q = categoryActiveTab;
        if(query?.page) {
            page = parseInt(query.page);
        }
        getGames(page, q);
    }, [url]);


    useEffect(() => {
        //...
        if(query?.q){
            setCategoryActiveTab(query.q);

            searchGamesFilter(query.q);
        } else {
            setGamesData(gamesAllData);
        }
    }, [url, gamesAllData]);

    

    const searchGamesFilter = (query) => {
        //startsWith. //includes
        let filteredGames = gamesAllData;
        if(query != 'ALL'){
            filteredGames = gamesAllData?.length && gamesAllData.filter(game =>
                game.category.title.includes(query)
            );
        }
        
        
        setGamesData(filteredGames);

    };



    // Auto-slide for trending games
    useEffect(() => {
        if (!trendingGamesData || trendingGamesData.length <= slidesPerView) {
            return; // Don't auto-slide if there are not enough items
        }
        
        const timer = setInterval(() => {
            setTrendingSlide((prev) => {
                // Calculate the maximum slide position
                const maxSlide = Math.max(0, trendingGamesData.length - slidesPerView);
                // If we're at the end, go back to the beginning
                if (prev >= maxSlide) {
                    return 0;
                }
                // Otherwise, move to the next slide
                return prev + 1;
            });
        }, 3000); // Change slides every 3 seconds (you can adjust this)
        
        return () => clearInterval(timer);
    }, [trendingGamesData, slidesPerView]);
    

    useEffect(() => {
        if (!heroSliderData || heroSliderData.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSliderData?.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [heroSliderData]);

    // Swipe / Drag logic
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let startX = 0;
        let isDown = false;

        const handleTouchStart = (e) => {
        startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        handleSwipe(endX - startX);
        };

        const handleMouseDown = (e) => {
        isDown = true;
        startX = e.clientX;
        };

        const handleMouseUp = (e) => {
        if (!isDown) return;
        isDown = false;
        const endX = e.clientX;
        handleSwipe(endX - startX);
        };

        const handleSwipe = (deltaX) => {
        if (Math.abs(deltaX) < 50) return; // ignore small moves
        if (deltaX > 0) {
            // Swipe right
            setCurrentSlide((prev) =>
            prev === 0 ? heroSliderData.length - 1 : prev - 1
            );
        } else {
            // Swipe left
            setCurrentSlide((prev) => (prev + 1) % heroSliderData.length);
        }
        };

        // Add listeners
        slider.addEventListener('touchstart', handleTouchStart);
        slider.addEventListener('touchend', handleTouchEnd);
        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mouseup', handleMouseUp);

        return () => {
        slider.removeEventListener('touchstart', handleTouchStart);
        slider.removeEventListener('touchend', handleTouchEnd);
        slider.removeEventListener('mousedown', handleMouseDown);
        slider.removeEventListener('mouseup', handleMouseUp);
        };
    }, [heroSliderData]);


    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setSlidesPerView(1);
            } else if (width <= 992) {
                setSlidesPerView(2);
            } else if (width <= 1200) {
                setSlidesPerView(3);
            } else {
                setSlidesPerView(4);
            }
        };

        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);


    const maxTrendingSlide = Math.max(0, trendingGamesData?.length - slidesPerView);

    const getHeroSliders = async () => {
        try {
            setIsLoading(true);
            const response = await HomeSliderService.findAllActive();
            setHeroSliderData(response.data.data);
        } catch (error) {
            console.log("error", error);
            // Set default data if failed
            setHeroSliderData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const getTrendingGames = async () => {
        try {
            setIsLoading(true);
            const response = await HomeTrendingService.findAllActive();
            setTrendingGamesData(response.data.data);
        } catch (error) {
            console.log("error", error);
            // Set default data if failed
            setTrendingGamesData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategories = async () => {
        try {
            setIsLoading(true);
            const response = await CategoryService.findAllActive();
            setCategoryData(response.data.data);
        } catch (error) {
            console.log("error", error);
            // Set default data if failed
            setCategoryData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const getFavorite = async () => {
        try {
            setIsLoading(true);
            const response = await FavoriteService.myFavoriteFront();
            setMyFavoriteData(response.data.data);
        } catch (error) {
            console.log("error", error);
            // Set default data if failed
            setMyFavoriteData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const getGames = async (page, q='ALL') => {
        if(!gamesData?.length){
            try {
                setIsLoading(true);
                const response = await GamesService.findAllActive(q);
                setGamesAllData(response.data.data);
            } catch (error) {
                console.log("error", error);
                // Set default data if failed
                setGamesAllData(undefined);
            } finally {
                setIsLoading(false);
            }
            
        }
    };


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }



    

    const checkAuth = () => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    }

    let loginCheckInterval = null;
    const handleTrendingFavoriteClick = async (gameData) => {

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
                    handleTrendingFavoriteClick(gameData);
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


    return (
        <>
            {/* <Seo
                title="GamesCookie – Play Free Online HTML5 Games Instantly"
                description="Play the best free online HTML5 games on GamesCookie. Enjoy action, arcade, puzzle, racing, and adventure games instantly — no downloads required!"
                keywords="free online games, HTML5 games, browser games, play games online, action games, puzzle games, racing games, adventure games, instant play, no download games"
                canonical={`${import.meta.env.VITE_BASE_URL}`}
                ogType="website"
            /> */}

            <div id="home" className={`${isFilter}`}>
                <div className="hero-section mb-4">

                    {!isLoading && heroSliderData && heroSliderData.length > 0 && (
                    <div className="hero-slider-container" ref={sliderRef}>
                        {heroSliderData && heroSliderData.map((slide, idx) => (
                        
                        <div key={idx} className={`carousel-item ${idx === currentSlide ? 'active' : ''}`}>
                            <a href={slide.url}>
                                <img src={`${import.meta.env.VITE_API}/${slide.image}`} alt={slide.title} />
                                <div className="carousel-caption">
                                    <h2><i className={`fas ${slide.icon}`}></i> {slide.title}</h2>
                                    <p>{slide.description}</p>
                                    <a href={slide.url} className="play-btn">
                                        <i className="fas fa-play"></i> Play Now
                                    </a>
                                </div>
                            </a>
                        </div>
                        ))}
                        
                        <div className="carousel-nav">
                        {heroSliderData && heroSliderData.map((_, idx) => (
                            <button 
                            key={idx} 
                            className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                            />
                        ))}
                        </div>
                    </div>
                    )}
                    
                    {/* Advertisement */}
                    {/* <Ads1 /> */}
                    <GoogleAd slot="4090728752" width="300" height="400"/>
                </div>
            </div>

            {/* Advertisement */}
            {/* <Ads2 class={`repo ad1 ${isFilter}`}/> */}
            <GoogleAd slot="6126807102" width="1200" height="100"/>
            <GoogleAdResponsive slot="6550721541"/>

            {/* Trending Games */}
            {!isLoading && trendingGamesData && trendingGamesData.length > 0 && (
            <div className={`container ${isFilter}`} id="trending">
                <h2 className="section-title mt-4"><i className="fas fa-fire-flame-curved"></i> Trending Games</h2>
                <div className="slider-container">
                    {trendingSlide > 0 && (
                        <button 
                        className="slider-button prev"
                        onClick={() => setTrendingSlide(Math.max(0, trendingSlide - 1))}
                        >
                        <i className="fas fa-chevron-left"></i>
                        </button>
                    )}
                
                    <div className="slider-wrapper" style={{ transform: `translateX(-${trendingSlide * (100 / slidesPerView)}%)` }}>
                        {trendingGamesData && trendingGamesData.map((game, idx) => (
                        <div key={idx} className="slider-item p-2">
                            
                            <div className="game-card">
                                <a href={`game/${game.game.id}/${game.game.slug}`} class="card-anc">
                                    <div className="game-card-img">
                                        <img src={`${import.meta.env.VITE_API}/${game.game.image}`} alt={game.game.title} />
                                        <span className="game-badge">{game.tag}</span>
                                    </div>
                                </a>
                                <div className="game-card-body">
                                    {game.game?.category && <div className="game-card-genre">{game.game.category.title}</div>}
                                    <button class={`favorite-btn one `} onClick={()=>handleTrendingFavoriteClick(game.game, idx)}>
                                        <i class={`fa-${checkFavorite(game.game)} fa-heart`}></i>
                                    </button>
                                   

                                    <h5 className="game-card-title">{game.game.title}</h5>
                                    <a href={`game/${game.game.id}/${game.game.slug}`} className="play-btn"><i className="fas fa-play"></i> Play Now</a>
                                </div>
                            </div>
                            
                        </div>
                        ))}
                    </div>
                    
                    {trendingSlide < maxTrendingSlide && (
                        <button 
                        className="slider-button next"
                        onClick={() => setTrendingSlide(Math.min(maxTrendingSlide, trendingSlide + 1))}
                        >
                        <i className="fas fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            </div>
            )}
            
            <div id="scroolHere"></div>
            {/* Advertisement */}
            {/* <Ads2 /> */}
            <GoogleAd slot="4901355345" width="1200" height="100" class="mt-2"/>
            <GoogleAdResponsive slot="4697749678" class="mb-4"/>
            
            {/* Game Categories */}
            {!isLoading && categoryData && categoryData.length > 0 && (
            <div className="container" id="categories">
                <h2 className="section-title mt-4"><i className="fas fa-grip"></i> Game Categories</h2>
                <div className="categories-grid pt-3">
                    <a className={`category-card ${categoryActiveTab=='ALL'?'active':''}`} href="/?q=ALL">
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_BASE_URL}/images/allgame.png`} alt="ALL GAMES icon" class="category-img" /> */}
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <h6>ALL GAMES</h6>
                    </a>
                    
                    {categoryData && categoryData.map((cat, idx) => (
                    <a key={idx} className={`category-card m-2 ${categoryActiveTab==cat.title?'active':''}`} href={`/?q=${cat.title}`}>
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_API}/${cat.image}`} alt={cat.title} class="category-img" /> */}
                            <i class={`fas fa-${cat.icon}`}></i>
                        </div>
                        <h6>{cat.title}</h6>
                    </a>
                    ))}
                </div>
            </div>
            )}

            {/* All Games */}
            {!isLoading && gamesData && gamesData.length > 0 && (
            <div className="container rtx" id="allgames">
                <h2 className="section-title"><i className="fas fa-layer-group"></i> {capitalizeFirstLetter(categoryActiveTab)} Games</h2>
                <div className="row p-2 pt-0" id="games-grid">
                {gamesData && gamesData.map((game, idx) => {
                    
                    return (
                        <>
                            <Games
                                index={idx}
                                game={game}
                                key={idx}
                                categoryActiveTab={categoryActiveTab}
                                myFavoriteData={myFavoriteData}
                                getFavorite={getFavorite}
                                />

                            {((idx + 1) % 6 === 0)&& 
                                // <Ads4 class="only-resp"/>
                                <div className={`container only-resp`}>
                                <GoogleAdResponsive slot="5976006475" class="mt-2"/>
                                </div>
                            }
                            {((idx + 1) % 12 === 0)&& 
                                // <Ads4 class="only-web"/>
                                <div className={`container only-web mt-3`}>
                                <GoogleAd slot="9983674523" width="1200" height="100"/>
                                </div>
                            }
                        </>
                    )
                })}
                </div>
            </div>
            )}

            

        </>
    );
}

export default Home;