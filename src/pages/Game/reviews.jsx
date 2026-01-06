import { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';

import GamesService from "../../services/games.service";
import ReviewsService from "../../services/reviews.service";
import { Pagination } from "../../components/Pagination.jsx";

import { Ads2, Ads3, Ads4 } from '../../components/Ads.jsx';
import { GoogleAd, GoogleAdResponsive } from '../../components/GoogleAd.jsx';
import Seo from '../../components/Seo.jsx';

import { Toast } from '../../components/Toast.jsx';
import './review.css';
import { useAuth } from "../../contexts/AuthContext";
import Helper from "../../helper";

export function GameDetailsReview(props) {
    const { openLogin } = useAuth();

	const { url, query } = useLocation();
	const gameId = props.id;

	const [gameData, setGameData] = useState(undefined);
	const [reviews, setReviews] = useState(undefined);

    const [currentRating, setCurrentRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    let page = 1;

    useEffect(() => {
        if(query?.page) {
            page = parseInt(query.page);
        }

        getReviews(page);

        getGames();
    }, [url]);

    const getGames = async () => {
        await GamesService.findOne(gameId).then(
            (response) => {
                setGameData(response.data);
            },
            error => {
                console.log("error", error)
            }
        );
    };

    const getReviews = async (page) => {
        const limit = 10;
    
        await ReviewsService.findAll(gameId, page, limit).then(
          (response) => {
            const reviews = response.data;
            setReviews(reviews);
          },
          error => {
            console.log("error", error)
          }
        );
    };


    const checkAuth = () => {
          return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
      }
    
      let loginCheckInterval = null;
      const submitReview = () => {
    
        // if (currentRating === 0 || reviewComment.trim() === '') {
        if (currentRating === 0) {
          alert('Please provide rating!');
          // alert('Please provide both a rating and a comment!');
          return;
        }
    
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
                    submitReview();
                }
            }, 3000);
            return;
        }
        
    
        const data = {
          gameId: gameId,
          rating: currentRating,
          comment: reviewComment
        }
    
        ReviewsService.create(data).then(
            (response) => {
                setCurrentRating(0);
                setReviewComment('');
                getGames();
                getReviews(1);
                Toast('success', response?.data.message);
            },
            error => {
                console.log("error", error)
                Toast('error', error);
            }
        );
    
    };


    const renderStars = (rating, className = '') => {
        return (
        <div className={`star-container ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
            <span 
                key={star}
            >
                <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={star <= rating ? '#FFD700' : 'none'}
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10" />
                </svg>
            </span>
            ))}
        </div>
        );
    };


	return (
		<>
		{gameData && (
        <>
        <Seo
			title={gameData.meta_title}
			description={gameData.meta_description}
			keywords={gameData.meta_keywords}
            image={`${import.meta.env.VITE_API}/${gameData.data.image}`}
			canonical={`${import.meta.env.VITE_BASE_URL}/game/${gameData.data.id}/${gameData.data.slug}/reviews`}
			ogType={gameData.data.category.title}
			/>

        {/* Game Header */}
        <div className="game-header p-0">
            <div className="container p-4 pt-0">
            <div className="game-header-content">
                <div className="game-thumbnail">
                <img src={`${import.meta.env.VITE_API}/${gameData.data.image}`} alt={gameData.data.title} />
                </div>
                <div className="game-info">
                <h1>{gameData.data.title}</h1>
                <div className="game-meta mb-0">
                    <div className="meta-item">
                    <i className="fas fa-gamepad"></i>
                    <span>{gameData.data.category.title}</span>
                    </div>
                </div>
                <div className="rating-display m-0 pb-3">
                    <div className="review-stars">
                        {renderStars(reviews.average, 'medium')}
                    </div>
                    <span className="rating-number">{reviews.average}</span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>
                    ({reviews.totalItems} reviews)
                    </span>
                </div>
                <a className="play-game-btn" href={`${import.meta.env.VITE_BASE_URL}/game/${gameData.data.id}/${gameData.data.slug}`}>
                    <i className="fas fa-play"></i> Play Now
                </a>
                </div>
            </div>
            </div>
        </div>

		<div className="container mb-4">
            <div className="row">
                {/* Left Column - Reviews */}
                <div className="col-lg-9">
                    {/* Rating Statistics */}
                    {/* <div className="stats-box">
                    <h3><i className="fas fa-chart-bar"></i> Rating Breakdown</h3>
                    <div className="rating-breakdown">
                        {ratingBreakdown.map((item) => (
                        <div className="rating-row" key={item.stars}>
                            <span className="rating-label">{item.stars} stars</span>
                            <div className="rating-bar">
                            <div className="rating-bar-fill" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                            <span className="rating-count">{item.count}</span>
                        </div>
                        ))}
                    </div>
                    </div> */}

                    {/* Write Review Form */}
                    <div className="write-review-form">
                        <h3><i className="fas fa-edit"></i> Write Your Review</h3>
                        <div className="star-rating-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                key={star}
                                onClick={() => setCurrentRating(star)}
                                className={`star-rating-button ${star <= currentRating ? 'active' : 'inactive'}`}
                                >
                                <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill={star <= currentRating ? '#FFD700' : 'none'}
                                stroke="#FFD700"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                >
                                <polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10" />
                                </svg>
                                </button>
                            ))}
                            {currentRating > 0 && (
                                <span className="rating-display">({currentRating}/5)</span>
                            )}
                        </div>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this game..."
                            rows="4"
                            className="review-textarea"
                            />
                        <button type="button" onClick={submitReview} className="submit-review-btn">
                            <i className="fas fa-paper-plane"></i> Submit Review
                        </button>
                    </div>

                    {/* Middle Ad Banner */}
                    {/* <Ads4 class="mb-4"/> */}
                    <div class="mb-4">
                    <GoogleAd slot="2557746115" width="728" height="90"/>
                    <GoogleAdResponsive slot="3530624779" class="mt-2"/>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section">
                    <div className="section-header">
                        <h2><i className="fas fa-comments"></i> Player Reviews ({reviews.totalItems})</h2>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-list">
                        {reviews?.content && reviews.content.map((review, index) => (
                        <div className="review-card" key={index}>
                            <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                    {review.user.image ? (
                                    <img src={`${import.meta.env.VITE_BASE_URL}/avatars/${review.user.image}`} />
                                    ) : (
                                    review.user.initial
                                    )}
                                </div>
                                <div className="reviewer-details">
                                <h4>{review.user.name}</h4>
                                <span className="review-date">
                                    🕐 {Helper.dateFormat(review.createdAt)}
                                </span>
                                </div>
                            </div>
                            <div className="review-stars">
                                {renderStars(review.rating, 'medium')}
                            </div>
                            </div>
                            {review.comment && <p className="review-text">{review.comment}</p>}
                        </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {reviews?.totalPages>1 &&
                    <ul class="pagination mt-3">
                        {(reviews.currentPage > 1) &&
                            <li class="page-item"><a class="page-link" href={`${import.meta.env.VITE_BASE_URL}/game/${gameData.data.id}/${gameData.data.slug}/reviews?page=${reviews.currentPage - 1}`}>Previous</a></li>
                        }
                        
                        <li class="page-item"><a class="page-link" href="javascript:void(0)">{reviews.currentPage} of {reviews.totalPages}</a></li>
                        
                        {(reviews.currentPage < reviews.totalPages) &&
                            <li class="page-item"><a class="page-link" href={`${import.meta.env.VITE_BASE_URL}/game/${gameData.data.id}/${gameData.data.slug}/reviews?page=${reviews.currentPage + 1}`}>Next</a></li>
                        }
                    </ul>
                    }
                    

                    {/* <div className="pagination-container">
                        <ul className="pagination">
                        <li className="page-item active">
                            <a className="page-link" href="#">1</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">4</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">5</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">Next</a>
                        </li>
                        </ul>
                    </div> */}
                    </div>
                </div>

                {/* Right Column - Sidebar Ads */}
                <div className="col-lg-3">
                    {/* <Ads3 /> */}
                    <GoogleAd slot="7240578228" width="330" height="600" />
                </div>
            </div>
        </div>
        </>
		)}


        </>
	);
}
