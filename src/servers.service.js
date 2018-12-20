let http = require("./http");

module.exports = class ServerService {
    constructor(config) {
        this.servers = {}
        for (let server of config.SERVERS) this.servers[server.host] = server
        for (let host in this.servers) {
            let server = this.servers[host];
            http.get("http://" + server.ip + ":" + server.port)
                .then(data => {
                    this.servers[host].monit = data
                    this.servers[host].status = 'online'
                })
                .catch(error => {
                    this.servers[host].monit = null
                    this.servers[host].status = 'offline'
                    console.error(error.message)
                })
        }

    }//101.200.136.234

    GetServers() {
        return this.servers;
    };

    GetServer(host) {
        return this.servers[host];
    };
}