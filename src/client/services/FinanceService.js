import axios from "axios";

const url = "http://localhost:5000/api/finances";

class FinanceService {
    static getFinances(credentials) {
        return axios.post(url, credentials);
    }
}

export default FinanceService;
