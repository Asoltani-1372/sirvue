import Config from '../config.js'
import axios from 'axios'


export default class TimingsService {
    getTimings(responseFunc, errorFunc) {
        axios.get(Config.api + "servant/timings", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    addTiming(timing, responseFunc, errorFunc) {
        axios.post(Config.api + "servant/timings/add", timing, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responseFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    deleteTimings(timings, responsFunc, errorFunc) {
        axios.post(Config.api + "servant/timings/delete", { timings }, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc();
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

}