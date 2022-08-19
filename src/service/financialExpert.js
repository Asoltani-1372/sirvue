import Config from './config.js'
import axios from 'axios'

export default class FinancialService {

    getList(status, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "serviceHistories?status=" + status, Config.headers())
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

    calculate(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceHistories/calculate/" + data.id, data, Config.headers())
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

    refine(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "serviceHistories/refine/" + id, {}, Config.headers())
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


    getPayRequests(status, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "payRequests/" + status, Config.headers())
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


    payOf(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "payRequests/payOf/" + data.id, data, Config.headers())
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

    confirmRequest(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "payRequests/confirmRequest/" + id, {}, Config.headers())
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

    getTransactions(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "transactions", Config.headers())
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

    getOfflinePayments(status, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "offlinePayments/" + status, Config.headers())
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
            axios.post(Config.api + "offlinePayments/reject/" + id, {}, Config.headers())
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

    verify(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "offlinePayments/verify/" + id, {}, Config.headers())
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