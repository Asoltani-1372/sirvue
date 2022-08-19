import Config from '../config.js'
import axios from 'axios'

export default class ServicesService {
    getServices(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "manage-operation/services", Config.headers())
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

    storeService(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "manage-operation/storeService", data, Config.headers())
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

    updateService(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "manage-operation/updateService", data, Config.headers())
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

    activeService(service, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "manage-operation/activeService", {service}, Config.headers())
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

    deleteService(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "manage-operation/deleteService", {id}, Config.headers())
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