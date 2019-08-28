let url = require('url');

let request = {
    get url(){
        //this -> ctx.request
        return this.req.url
    },
    get path(){
        return url.parse(this.req.url).pathname;
    }
}
module.exports = request;