import Config from './config'
import axios from 'axios'


export default class Ticketervice {
    getTickets(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'support/tickets', Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }


    sendTicket(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'support/newTicket', data, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }


    getMessages(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'support/messages?ticket=' + id, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    sendMessage(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'support/sendMessage', data, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }


    setStars(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'support/setStars', data, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }
}