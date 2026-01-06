import http from "../http-common";

class DashboardService {


    //...Admin

    countAll() {
        return http.get(`/dashboard/countAll`);
    }

}

export default new DashboardService();