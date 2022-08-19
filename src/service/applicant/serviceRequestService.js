import Config from '../config.js'
import axios from 'axios'


export default class ServiceRequestService {
    getServices(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/services', Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }

    getCompanyUsers(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/companyUsers', Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }

    cancel(id, data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'serviceRequests/cancel/' + id, data, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }

    reject(id, data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'serviceRequests/reject/' + id, data, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }

    getServiceHistories(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceHistories', Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }


    getServiceHistoryDialog(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceHistories/' + id, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);

    }

    getTerrains(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/terrains', Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    getProducts(terrain, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/products/' + terrain, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    getPoisonTypes(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/poisonTypes', Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    getPoisons({ product, poisonType }, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests/initialize/poisons/' + product + '/' + poisonType, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    pricing(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/pricing', data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    store(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/store', data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    getList(responseFunc, errorFunc) {
        axios.get(Config.api + 'serviceRequests', Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    payRequest(id,type, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/payment/' + id + '?type=' + type, {}, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    setRate(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/rate/' + data.id, data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    broadcast(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/broadcast/' + data, {}, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    unbroadcast(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/unbroadcast/' + data, {}, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    move(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'serviceRequests/move/' + data, {}, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }
}