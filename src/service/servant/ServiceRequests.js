import Config from '../config.js'
import axios from 'axios'

export default class ServiceRequestsService {
    getList(status, responseFunc, errorFunc) {
        axios.get(Config.api + "serviceRequests?status=" + status.join(','), Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    getFlights(responseFunc, errorFunc) {
        axios.get(Config.api + "serviceRequests/flights", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    accept(request, responseFunc, errorFunc) {
        axios.post(Config.api + "serviceRequests/accept/" + request.id, { time: request.time }, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    drop(request, responseFunc, errorFunc) {
        axios.post(Config.api + "serviceRequests/drop/" + request, request, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    coordinate(request, responseFunc, errorFunc) {
        axios.post(Config.api + "serviceRequests/coordinate/" + request, {}, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    doit(request, responseFunc, errorFunc) {
        axios.post(Config.api + "serviceRequests/doit/" + request, {}, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }
}