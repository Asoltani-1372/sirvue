import Config from '../config.js'
import axios from 'axios'


export default class ServantService {
    getServices(responseFunc, errorFunc) {
        axios.get(Config.api + "services", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    applyChange(data, responseFunc, errorFunc) {
        axios.post(Config.api + "services/pickout", data, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }
}
