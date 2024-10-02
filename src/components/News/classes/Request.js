import { ajax } from 'rxjs/ajax';

const wsPort = process.env.PORT || 6868;
const serverUrl = process.env.PROD_SERVER || '://localhost';
const serverProtocol = process.env.PROD_PROTOCOL || 'http';

export default class Request {
    constructor() {
        this.url = serverUrl;
    }

    getRxJsAjax(body=false, method='GET',  url='', protocol=serverProtocol) {
        const requestParams = this._paramConstructor(url, method, body, protocol);
        return ajax(requestParams);
    }

    async send(body=false, method='GET',  url='', protocol=serverProtocol) {
        const requestParams = this._paramConstructor(url, method, body, protocol);
        return await fetch(requestParams.url, requestParams.params);
    }

    _paramConstructor(uri='', method='GET', body=false, protocol=serverProtocol) {
        const params = {
            url: `${protocol}${this.url}:${wsPort}${uri}`,
            params: {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                method
            }
        }

        if(body) {
            params.params.body = JSON.stringify(body);
        }

        return params;
    }
}