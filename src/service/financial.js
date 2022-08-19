import Config from "./config";
import axios from "axios";

export default class financialService {

    getTransactions(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "transactions", Config.headers())
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

    getWallet(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "wallet", Config.headers())
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

    increaseBalance(amount, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "wallet/increase", amount, Config.headers())
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

    getPayRequests(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "payRequests", Config.headers())
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

    storePayRequest(clearing, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "payRequests/store", clearing, Config.headers())
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


    getBankAccounts(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "bankAccounts", Config.headers())
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

    storeBankAccount(bankAccount, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "bankAccounts/store", bankAccount, Config.headers())
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

    updateBankAccount(bankAccount, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "bankAccounts/update/" + bankAccount.id, bankAccount, Config.headers())
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

    destroyBankAccount(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "bankAccounts/destroy/" + id, {}, Config.headers())
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


    getOfflinePayments(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + "offlinePayments", Config.headers())
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

    storeOfflinePayments(payment, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + "offlinePayments/store", payment, Config.headers())
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