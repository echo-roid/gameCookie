import FavoriteService from "../services/favorite.service";

import { Toast } from '../components/Toast.jsx';
import { useAuth } from "../contexts/AuthContext";

export function Games(props) {
    const { openLogin, isAuthenticated } = useAuth();

    const game = props.game;

    

    let isFilter = false;
    if(props.categoryActiveTab != 'ALL'){
        isFilter = true;
    } else {
        isFilter = false;
    }


    let isFavourite = false;
    if(game.isFavourite){
        isFavourite = true;
    }

    let exists = false;
    if(props.myFavoriteData){
        exists = props.myFavoriteData.includes(game.id);
        if(exists){
            isFavourite = true;
        }
    }

    const checkAuth = () => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    }

    let loginCheckInterval = null;
    const handleFavoriteClick = async (gameData) => {

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
                    handleFavoriteClick(gameData);
                }
            }, 3000);
            return;
        }

        // Authenticated → Proceed with API call
        try {
            const data = { gameId: gameData.id };
            
            const response = await FavoriteService.favorite(data);
            props.getFavorite();
            Toast("success", response.data.message);
        
        } catch (error) {
            console.log("error", error);
            Toast("error", error);
        }

    };
    

    
    
    return (
        <div class={`col-6 col-xl-2 col-lg-4 col-md-6 col-sm-6 cp-3 ALL ${game.category.title} `} key={props.key}>
            <div className="game-card cust">
                <a href={`game/${game.id}/${game.slug}`}>
                    <div className="game-card-img">
                        <img src={`${import.meta.env.VITE_API}/${game.image}`} alt={game.title} />
                    </div>
                </a>
                
                <div className="game-card-body">
                    {game?.category && <div className="game-card-genre">{game.category.title}</div>}
                    
                    <button class={`favorite-btn `} onClick={()=>handleFavoriteClick(game)}>
                        <i class={`fa-${isFavourite ? 'solid' : 'regular'} fa-heart`}></i>
                    </button>

                    <h5 className="game-card-title">{game.title}</h5>
                    <a href={`game/${game.id}/${game.slug}`} className="play-btn"><i className="fas fa-play"></i> Play Now</a>
                </div>

            </div>
        </div>
	);
}