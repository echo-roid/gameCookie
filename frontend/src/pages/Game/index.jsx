import React, { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';

import { Ads1, Ads2, Ads4 } from '../../components/Ads.jsx';
import { Games } from '../../components/Games.jsx';
import { GoogleAd, GoogleAdResponsive } from '../../components/GoogleAd.jsx';
import Seo from '../../components/Seo.jsx';

//...services
import CategoryService from "../../services/category.service";
import GamesService from "../../services/games.service";
import FavoriteService from "../../services/favorite.service.jsx";

import { Toast } from '../../components/Toast.jsx';
import AuthService from "../../services/auth.service";


export const GamesData = () => {
    const { url, query } = useLocation();


    const [categoryData, setCategoryData] = useState(undefined);
    
    const [gamesAllData, setGamesAllData] = useState(undefined);
    const [gamesData, setGamesData] = useState(undefined);

    const [myFavoriteData, setMyFavoriteData] = useState(undefined);
    const [categoryActiveTab, setCategoryActiveTab] = useState('ALL');
    
    let page = 1;

    useEffect(() => {
        //
        getCategories();
        getFavorite();
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

    const getGames = async (page, q='ALL') => {
        if(!gamesData?.length){
            await GamesService.findAllActive(q).then(
                (response) => {
                    setGamesAllData(response.data.data);
                    // setGamesData(response.data.data);
                },
                error => {
                    console.log("error", error)
                }
            );
        }
    };


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }


    return (
        <>
            {/* <Seo
                title="Play Free Online HTML5 Games – GamesCookie"
                description="Discover and play the best free online HTML5 games instantly on GamesCookie. Enjoy action, puzzle, racing, arcade, and adventure games — no downloads needed!"
                keywords="free online games, play games online, HTML5 games, browser games, no download games, action games, puzzle games, arcade games, racing games, adventure games"
                canonical={`${import.meta.env.VITE_BASE_URL}/games`}
                ogType="website"
                /> */}

            
            {/* Game Categories */}
            <div className="container" id="categories">
                <h2 className="section-title mt-0"><i className="fas fa-grip"></i> Game Categories</h2>
                <div className="categories-grid pt-3">
                    <a className={`category-card ${categoryActiveTab=='ALL'?'active':''}`} href="/games?q=ALL">
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_BASE_URL}/images/allgame.png`} alt="ALL GAMES icon" class="category-img" /> */}
                            <i class="fas fa-gamepad"></i>
                        </div>
                        <h6>ALL GAMES</h6>
                    </a>
                    
                    {categoryData && categoryData.map((cat, idx) => (
                    <a key={idx} className={`category-card m-2 ${categoryActiveTab==cat.title?'active':''}`} href={`/games?q=${cat.title}`}>
                        <div className="category-icon">
                            {/* <img src={`${import.meta.env.VITE_API}/${cat.image}`} alt={cat.title} class="category-img" /> */}
                            <i class={`fas fa-${cat.icon}`}></i>
                        </div>
                        <h6>{cat.title}</h6>
                    </a>
                    ))}
                </div>
            </div>

            {/* Advertisement */}
            {/* <Ads2 /> */}
            <GoogleAd slot="6126807102" width="1200" height="100"/>

            {/* All Games */}
            <div className="container rtx" id="allgames">
                <h2 className="section-title mt-3"><i className="fas fa-layer-group"></i> {capitalizeFirstLetter(categoryActiveTab)} Games</h2>
                <div className="row p-2" id="games-grid">
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
                                <div className={`container`}>
                                <GoogleAdResponsive slot="5293480194" class="mt-2"/>
                                </div>
                            }
                            {((idx + 1) % 18 === 0)&& 
                                // <Ads4 class="only-web"/>
                                <div className={`container`}>
                                <GoogleAd slot="9983674523" width="1200" height="100"/>
                                </div>
                            }
                        </>
                    )
                })}
                </div>
            </div>

        </>
    );
}

export default GamesData;