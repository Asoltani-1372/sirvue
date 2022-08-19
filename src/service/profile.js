import Config from './config'
import axios from 'axios'


export default class ProfileService {
    getProfile(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'profile?id=' + id, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
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

    changeAvatar(avatar, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/avatar', avatar, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    updateDetails(details, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/details', details, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data.place);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    updatePlace(place, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/place', place, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    changeIdentity(identity, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/identity', identity, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data.identity);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    changePassword(password, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/password', password, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    changeSecurity(security, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'profile/security', security, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok) responseFunc(data);
                    else errorFunc(data.error);
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

}