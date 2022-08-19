import Config from '../config.js'
import axios from 'axios'

export default class TasksService {
    getTasks(responsFunc, errorFunc) {
        axios.get(Config.api + "reserves/getTasks", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc(data);
                else
                    errorFunc(data);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    notifyDone(id, responsFunc, errorFunc) {
        axios.post(Config.api + "reserves/notifyDone", id, Config.headers())
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