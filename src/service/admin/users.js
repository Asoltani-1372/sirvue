import Config from '../config.js'
import axios from 'axios'

export default class UsersService {
    getUsers(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "manage-operation/users", Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error)
                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    verifyUser(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'manage-operation/verifyUser', data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    updateRole(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'manage-operation/updateRole', data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

    storeUser(data, responseFunc, errorFunc) {
        axios.post(Config.api + 'manage-operation/storeUser', data, Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }

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
                .catch((error) => errorFunc(error));
        }, 300);
    }

    storeService(responseFunc, errorFunc) {
        axios.post(Config.api + 'manage-operation/storeUser', Config.headers())
            .then((response) => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data.error);

            }).catch((error) => Config.handleError(error, errorFunc));
    }



}