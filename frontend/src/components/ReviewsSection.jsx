import React, { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';

import ReviewsService from "../services/reviews.service";
import { Toast } from './Toast.jsx';
import Helper from "../helper";
import { useAuth } from "../contexts/AuthContext";

export function ReviewsSection(props) {
	const { openLogin, isAuthenticated } = useAuth();
  
  const gameId = props.gameId;
  const { url } = useLocation();

  const [currentRating, setCurrentRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const [reviews, setReviews] = useState(undefined);

  const [showReviews, setShowReviews] = useState(false);
  

  useEffect(() => {
      getReviews();
      setCurrentRating(0);
      setReviewComment('');
  }, [url]);

  const getReviews = async () => {
    const page = 1;
    const limit = 2;

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
            getReviews();
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
      <div className="game-reviews-wrapper mb-4">
        <div className="reviews-section">
          
          
          {/* Rating Overview */}
          {reviews?.totalItems > 0 &&
          <>
          <h2 className="reviews-title">💬 Player Reviews ({reviews.totalItems || 0})</h2>
          <div className="rating-overview">
            <div className="rating-overview-grid">
              {/* Average Rating */}
              <div className="average-rating">
                <div className="average-rating-number">{reviews.average}</div>
                {renderStars(Math.round(reviews.average), 'large')}
                <div className="average-rating-text" onClick={()=>setShowReviews(showReviews ? false : true)}>{reviews.totalItems} reviews</div>
              </div>
              
              {/* Rating Distribution */}
              {/* <div className="rating-distribution">
                {[
                  { stars: 5, count: 5234, width: '63.5%' },
                  { stars: 4, count: 2145, width: '26%' },
                  { stars: 3, count: 645, width: '7.8%' },
                  { stars: 2, count: 156, width: '1.9%' },
                  { stars: 1, count: 54, width: '0.7%' }
                ].map(({ stars, count, width }) => (
                  <div key={stars} className="rating-bar-item">
                    <span className="rating-bar-label">{stars}⭐</span>
                    <div className="rating-bar-container">
                      <div className="rating-bar-fill" style={{ width }} />
                    </div>
                    <span className="rating-bar-count">{count}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          </>
          }

          {/* Add Review Form */}
          <div className="add-review-form mb-10">
            <h3 className="add-review-title">✏️ Leave a Review</h3>
            <div className="star-rating-container">
              {/* {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setCurrentRating(star)}
                  className={`star-rating-button ${star <= currentRating ? 'active' : 'inactive'}`}
                >
                  ⭐
                  
                </button>
              ))} */}
              <div className="star-wrapper" style={{ display: 'flex', gap: '6px' }}>
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
            </div>
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
              📝 Submit Review
            </button>
          </div>


          {/* Reviews List */}
          {showReviews &&
          <div className="reviews-list">
            {reviews?.content && reviews.content.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-content">
                  
                  <div className="review-avatar">
                    {review.user.image ? (
                      <img src={`${import.meta.env.VITE_BASE_URL}/avatars/${review.user.image}`} />
                    ) : (
                      review.user.initial
                    )}
                  </div>

                  <div className="review-body">
                    <div className="review-header">
                      <span className="review-username">{review.user.name}</span>
                      <span className="review-date">🕐 {Helper.dateFormat(review.createdAt)}</span>
                    </div>
                    <div className="review-stars">
                      {renderStars(review.rating, 'medium')}
                      <span className="review-rating-text">({review.rating}/5)</span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            <a href={`${import.meta.env.VITE_BASE_URL}/game/${props.gameData.id}/${props.gameData.slug}/reviews`}>View All Reviews</a>

          </div>
          }



          {/* Load More Button */}
          {/* <div className="load-more-container">
            <button className="load-more-btn">🔄 Load More Reviews</button>
          </div> */}
        </div>
      </div>
    </>
  );
}


