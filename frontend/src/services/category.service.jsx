import http from "../http-common";

class CategoryService {


    findAllActive() {
        return http.get(`/categories/front`);
    }

    //...Admin

    findAll(page) {
        return http.get(`/categories?page=${page}`);
    }

    // get(id) {
    //     return http.get(`/category/${id}`);
    // }

    create(data) {
        return http.post("/categories", data);
    }

    update(id, data) {
        return http.put(`/categories/${id}`, data);
    }

    delete(id) {
        return http.delete(`/categories/${id}`);
    }


}

export default new CategoryService();