const https = require('https');
const querystring = require('querystring');

module.exports = {
    get: (hostname, port, path, data) => {
        return new Promise(function (resolve, reject) {
            let options = {
                hostname: hostname,
                port: port || 443,
                path: path,
                method: 'GET'
            };
            if (data)
                options.path = options.path + '?' + querystring.stringify(data);
            let req = https.request(options, function (res) {
                let data = '';
                res.on('data', function (d) {
                    data += d;
                });
                res.on("end", function () {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        return reject({ errcode: 50000, errmsg: e, data: data });
                    }
                    if (data.errcode) {
                        return reject(data);
                    }
                    resolve(data);
                });
            });
            req.on('error', function (e) { return reject(e); });
            req.end();
        });
    },
    post: (hostname, port, path, data) => {
        return new Promise(function (resolve, reject) {
            let postData = JSON.stringify(data);
            let options = {
                hostname: hostname,
                port: port || 443,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            let req = https.request(options, function (res) {
                let data = '';
                res.on('data', function (d) {
                    data += d;
                });
                res.on("end", function () {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        return reject({ errcode: 50000, errmsg: e, data: data });
                    }
                    if (data.errcode) {
                        return reject(data);
                    }
                    resolve(data);
                });
            });
            req.on('error', function (e) { return reject(e); });
            req.write(postData);
            req.end();
        });
    },
}