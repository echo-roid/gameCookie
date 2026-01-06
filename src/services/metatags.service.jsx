import http from "../http-common";

class MetatagsService {


    findAllActive() {
        return http.get(`/metatags/front`);
    }
    

    findAll(page) {
        return http.get(`/metatags?page=${page}`);
    }

    //...Admin
    create(data) {
        return http.post("/metatags", data);
    }

    update(id, data) {
        return http.put(`/metatags/${id}`, data);
    }

    delete(id) {
        return http.delete(`/metatags/${id}`);
    }

}

export default new MetatagsService();