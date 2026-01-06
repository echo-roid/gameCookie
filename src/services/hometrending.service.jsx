import http from "../http-common";

class HomeTrendingService {


    findAllActive() {
        return http.get(`/hometrending/front`);
    }

    findOne(id) {
        return http.get(`/hometrending/one/${id}`);
    }
    


    findAll(page) {
        return http.get(`/hometrending?page=${page}`);
    }

    //...Admin
    create(data) {
        return http.post("/hometrending", data);
    }

    update(id, data) {
        return http.put(`/hometrending/${id}`, data);
    }

    delete(id) {
        return http.delete(`/hometrending/${id}`);
    }

}

export default new HomeTrendingService();