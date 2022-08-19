import Config from "../config";
import axios from "axios";

export default class identitiesService {
    getIdentities(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "identities", Config.headers())
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

    getIdentity(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "identities/" + id, Config.headers())
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

    verification(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/verification/" + data.id, data.verifications, Config.headers())
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