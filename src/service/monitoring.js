import Config from './config.js'
import axios from 'axios'

export default class monitoringService {

    getPastServices(responseFunc, errorFunc) {
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
            axios.get(Config.api + "serviceRequests/" + id, Config.headers())
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

    extensionDeadline(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "monitoring/extensionDeadline/" + data.id, data, Config.headers())
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

    pastServiceDetails(id, responseFunc, errorFunc) {
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

    ratingService(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "monitoring/ratingService/" + data.id, data, Config.headers())
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

    verifying(id, responseFunc, errorFunc){
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/verifying/" + id, {}, Config.headers())
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

    ban(id, responseFunc, errorFunc){
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/ban/" + id, {}, Config.headers())
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
