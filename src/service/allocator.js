import Config from './config.js'
import axios from 'axios'

export default class AllocatorService {
    getList(status, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceRequests?status=" + status, Config.headers())
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

    getHistories(responseFunc, errorFunc) {
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

    nearest(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceRequests/nearest/" + id, Config.headers())
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

    allocate(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/allocate/" + data.id, { servant: data.servant, transport: data.transport, price: data.price }, Config.headers())
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

    publish(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/publish/" + id, {}, Config.headers())
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

    transfer(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/transfer/" + id, {}, Config.headers())
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

    reject(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceRequests/reject/", { id }, Config.headers())
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

    cancel(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "allocator/cancelRequest", { id }, Config.headers())
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