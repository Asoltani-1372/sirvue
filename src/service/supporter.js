import Config from './config'
import axios from 'axios'


export default class SupporterService {
    getTickets(responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'supporter/tickets', Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    getMessages(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.get(Config.api + 'supporter/messages?ticket=' + id, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    sendMessage(data, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'supporter/sendMessage', data, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

    closeTicket(id, responseFunc, errorFunc) {
        setTimeout(() => {
            axios.post(Config.api + 'supporter/closeTicket', id, Config.headers()).then((response) => {
                const data = response.data;
                if (data.ok) responseFunc(data);
                else errorFunc(data.error);
            }).catch((error) => Config.handleError(error, errorFunc));
        }, 300);
    }

}