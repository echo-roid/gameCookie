import http from "../http-common";

class PartnerService {

    createHtmlGames(data) {
        return http.post("/partner/html_games", data);
    }

    createApplyJob(data) {
        return http.post("/partner/apply_job", data);
    }

}

export default new PartnerService();