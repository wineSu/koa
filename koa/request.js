let parse = require('parseurl');

let request = {
    get url(){
        return this.req.url;
    },
    get path(){
        return parse(this.req).pathname;
    }
}
module.exports = request;