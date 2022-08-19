import Config from '../config.js'
import axios from 'axios'

export default class CoverdPlacesService {
    getPlaces(responsFunc, errorFunc) {
        axios.get(Config.api + "servant/places", Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc(data.places);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    addPlace(body, responsFunc, errorFunc) {
        axios.post(Config.api + "servant/places/add", body, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc(data.places);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    deletePlaces(places, responsFunc, errorFunc) {
        axios.post(Config.api + "servant/places/delete",{ places } , Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc();
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }

    activePlace(place, responsFunc, errorFunc) {
        axios.post(Config.api + "servant/places/active", { place }, Config.headers())
            .then(response => {
                const data = response.data;
                if (data.ok)
                    responsFunc(data.active);
                else
                    errorFunc(data.error);
            })
            .catch((error) => Config.handleError(error, errorFunc));
    }
}