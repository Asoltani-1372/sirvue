import Config from '../config'
import axios from 'axios'

export default class ServiceService {
    getList(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "services", Config.headers())
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

    store(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "services/store", data, Config.headers())
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

    changeStatus(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "services/" + data.status + "/" + data.id, Config.headers())
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

    destroy(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "services/destroy/" + id,{}, Config.headers())
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

    update(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "services/update/" + data.id, data, Config.headers())
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