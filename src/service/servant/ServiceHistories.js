import Config from '../config.js'
import axios from 'axios'

export default class ServiceHistoriesService {
    getList(responsFunc, errorFunc) {
        axios.get(Config.api + "serviceHistories", Config.headers())
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