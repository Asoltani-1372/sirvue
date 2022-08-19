import Config from './config.js'
import axios from 'axios'

export default class MenuService {
    getMenu(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'menu', Config.headers())
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