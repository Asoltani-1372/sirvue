import Config from "../config";
import axios from "axios";

export default class IdentitiesService {

    getIdentity(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "identities/identity", Config.headers())
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


    updateNationalCard(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/nationalCard", data, Config.headers())
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

    updatePlaque(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/plaque", data, Config.headers())
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

    updateCertificate(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/certificate", data, Config.headers())
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

    updateRepresenter(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/representer", data, Config.headers())
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

    updateNoCriminalRecord(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/noCriminalRecord", data, Config.headers())
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

    updateDegreeEducation(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "identities/degreeEducation", data, Config.headers())
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
