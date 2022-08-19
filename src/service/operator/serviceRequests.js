import Config from "../config";
import axios from "axios";

export default class ServiceRequestService {

    getServiceRequests(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceRequests", Config.headers())
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

    serviceRequestDetails(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceRequestDetails/" + id, Config.headers())
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