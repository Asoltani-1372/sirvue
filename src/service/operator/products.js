import Config from '../config'
import axios from 'axios'

export default class TerrianService {
    getList(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "products", Config.headers())
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
            axios.post(Config.api + "products/store", data, Config.headers())
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

    update(product, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "products/update/" + product.id, product, Config.headers())
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
            axios.post(Config.api + "products/destroy/" + id,{}, Config.headers())
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
            axios.post(Config.api + "products/" + data.status + "/" + data.id,{}, Config.headers())
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