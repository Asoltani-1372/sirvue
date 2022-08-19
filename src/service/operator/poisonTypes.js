import Config from '../config'
import axios from 'axios'

export default class TerrianService {
    getList(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "poisonTypes", Config.headers())
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
            axios.post(Config.api + "poisonTypes/store", data, Config.headers())
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

    update(poisonType, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "poisonTypes/update/" + poisonType.id, poisonType, Config.headers())
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
            axios.post(Config.api + "poisonTypes/destroy/" + id,{}, Config.headers())
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
            axios.post(Config.api + "poisonTypes/" + data.status + "/" + data.id,{}, Config.headers())
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