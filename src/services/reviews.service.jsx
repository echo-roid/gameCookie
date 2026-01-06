import http from "../http-common";

class ReviewsService {


    findAll(gameId, page, limit) {
        return http.get(`/reviews/${gameId}?limit=${limit}&page=${page}`);
    }

    create(data) {
        return http.post("/reviews", data);
    }

}

export default new ReviewsService();