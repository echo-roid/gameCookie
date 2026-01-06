import http from "../http-common";

class HomeSliderService {


    findAllActive() {
        return http.get(`/heroslider/front`);
    }

    findOne(id) {
        return http.get(`/heroslider/one/${id}`);
    }
    


    findAll(page) {
        return http.get(`/heroslider?page=${page}`);
    }

    //...Admin
    create(data) {
        return http.post("/heroslider", data);
    }

    update(id, data) {
        return http.put(`/heroslider/${id}`, data);
    }

    delete(id) {
        return http.delete(`/heroslider/${id}`);
    }

}

export default new HomeSliderService();