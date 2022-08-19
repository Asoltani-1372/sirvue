import Config from '../config'
import axios from 'axios'

export default class usersService {
    getApplicants(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/applicants", Config.headers())
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

    getApplicant(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/applicant/" + id, Config.headers())
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

    getServants(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/servants", Config.headers())
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

    getServant(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/servant/" + id, Config.headers())
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

    getOthers(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/others", Config.headers())
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

    getOther(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/other/" + id, Config.headers())
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

    getRoles(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/create", Config.headers())
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

    storeUser(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/store", data, Config.headers())
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

    getEdit(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "users/edit", Config.headers())
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

    updateUser(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/update/" + data.id, data, Config.headers())
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

    blockUser(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/disable/" + id, {}, Config.headers())
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

    activeUser(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/enable/" + id, {}, Config.headers())
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

    changeStatus(status, id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/" + status + "/" + id, {}, Config.headers())
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

    destroyUser(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/destroy/" + id, {}, Config.headers())
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

    authenticateUser(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "users/authenticate?id=" + data.id, data, Config.headers())
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

    getServiceHistories(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceHistories?id=' + id, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    getServiceRequests(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'serviceRequests?id=' + id, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data);
                    else
                        errorFunc(data.error);

                }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }
}