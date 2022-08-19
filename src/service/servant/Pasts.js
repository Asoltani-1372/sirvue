import Config from '../config.js'
import axios from 'axios'

export default class PastsService {
    getPasts(responsFunc, errorFunc) {
        axios.get(Config.api + "reserves/getPasts", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }
}