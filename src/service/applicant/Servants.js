import Config from '../config.js'
import axios from 'axios'

export default class ServantsService {
    getServants(filter, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "applicant/servants", filter, Config.headers())
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