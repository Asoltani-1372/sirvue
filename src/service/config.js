export default class Config {
    static api = location.protocol + "//" + location.hostname + "/api/";
    static headers() {
        return {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }
    }

    static handleError(error, func) {
        try {
            if (error.response.status == 401) {
                error = error.response.data.error;
                func(error);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            }
            else if (error.response.status == 402) {
                error = error.response.data.error;
                func(error);
                setTimeout(() => {
                    history.back();
                }, 2000);
            }
            else if (error.response.status == 403) {
                error = error.response.data.error;
                func(error);
                setTimeout(() => {
                    window.location.href = '/' + error.response.data.role + '/';
                }, 2000);
            }
            else if (error.response.status == 412) {
                error = error.response.status;
                func(error);
            }
        } catch (e) {
            //
        }


    }
}
