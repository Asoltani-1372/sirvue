import Config from "../config";
import axios from "axios";

export default class ServiceHistoryService {

    getServiceHistories(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceHistories", Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    serviceDetails(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceHistories/" + id, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

}