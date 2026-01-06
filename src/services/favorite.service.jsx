import http from "../http-common";

class FavoriteService {

    findAll(page, q) {
        return http.get(`/favorite?page=${page}&q=${q}`);
    }

    favorite(data) {
        return http.post("/favorite", data);
    }

    myFavorite() {
        return http.get("/favorite/my");
    }

    myFavoriteFront() {
        return http.get("/favorite/front");
    }

}

export default new FavoriteService();