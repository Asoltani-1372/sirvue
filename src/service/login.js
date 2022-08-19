import Config from './config.js'
import axios from 'axios'

export default class LoginService {
    enterPhone(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "login/phone", data)
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data)
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    verifyCode(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "login/verifyCode", data)
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data)
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    setPassword(password, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "login/setPassword", password, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data)
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    enterPassword(password, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "login/checkPassword", password, Config.headers())
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data)
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }


    forgetPassword(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "login/forgetPassword", data)
                .then((response) => {
                    const data = response.data;
                    if (data.ok)
                        responseFunc(data)
                    else
                        errorFunc(data.error)
                })
                .catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

}