import Config from '../config.js'
import axios from 'axios'

export default class PlaceService {
    search(body, responsFunc, errorFunc) {
        axios.post(Config.api + "places/search", body, Config.headers())
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