let params = {}
for (let i = 2; i < process.argv.length; i ++) {
    if (process.argv[i] === '-f' || process.argv[i] === '--config') {
        params.config = process.argv[i + 1]
    }
    if (/=/.test(process.argv[i])) {
        let arr = process.argv[i].split('=')
        params[arr[0].replace('--', '')] = arr[1]
    }
}
let config = require(params.config || '../config.json')
const ServerService = require("./servers.service");
module.exports = new ServerService(config);