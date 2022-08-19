import Config from './config.js'
import axios from 'axios'


export default class OperationService {

    pairedsConfirm(id, responseFunc, errorFunc) {
        axios.post(Config.api + 'operation/confirmPaireds', {id}, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    pairedsReject(reject, responseFunc, errorFunc) {
        axios.post(Config.api + 'operation/rejectPaireds', reject, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    pairedsCancel(cancel, responseFunc, errorFunc) {
        axios.post(Config.api + 'operation/cancelPaireds', cancel, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    getPairedsPending(status, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "operation/pendingPaireds?status=" + status, Config.headers())
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

    getPairedsPast(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "operation/pastPaireds", Config.headers())
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