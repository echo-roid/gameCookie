import http from "../http-common";

class GamesService {


    findAllActive(q='') {
        return http.get(`/games/front?q=${q}`);
    }

    findOne(id) {
        return http.get(`/games/one/${id}`);
    }
    


    findAll(page, status, search) {
        return http.get(`/games?status=${status}&search=${search}&page=${page}`);
    }

    //...Admin
    create(data) {
        return http.post("/games", data);
    }

    update(id, data) {
        return http.put(`/games/${id}`, data);
    }

    delete(id) {
        return http.delete(`/games/${id}`);
    }

}

export default new GamesService();