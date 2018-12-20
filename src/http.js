const Url = require('url');
const Http = require('http');

function parseJson(string) {
    let json
    try {
        json = JSON.parse(string)
    } catch (e) {
    }
    return json
}

function _http({method, hostname, port, path, data}) {
    return new Promise(function (resolve, reject) {
        let postData = JSON.stringify(data);
        let options = {
            hostname: hostname,
            port: port || 80,
            path: path,
            method: method,
        };
        if (postData) {
            options.headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData, 'utf8')
            }
        }
        let req = Http.request(options, function (res) {
            let data = '';
            res.on('data', d => data += d);
            res.on("end", () => resolve(parseJson(data) || data));
        });
        req.on('error', e => reject(e));
        if (postData) req.write(Buffer.from(postData));
        req.end();
    });
}

_http.get = url => {
    let u = Url.parse(url)
    return _http({
        method: 'GET',
        hostname: u.hostname,
        port: u.port,
        path: u.path
    })
}
_http.post = (url, data) => {
    let u = Url.parse(url)
    return _http({
        method: 'POST',
        hostname: u.hostname,
        port: u.port,
        path: u.path,
        data: data
    })
}

module.exports = _http
