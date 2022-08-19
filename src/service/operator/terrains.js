import Config from '../config'
import axios from 'axios'

export default class TerrianService {
    getList(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "terrains", Config.headers())
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
            axios.post(Config.api + "terrains/store", data, Config.headers())
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

    update(terrain, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "terrains/update/" + terrain.id, terrain, Config.headers())
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
            axios.post(Config.api + "terrains/destroy/" + id,{}, Config.headers())
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
            axios.post(Config.api + "terrains/" + data.status + "/" + data.id,{}, Config.headers())
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