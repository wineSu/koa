let response = {
    set body(value){
        this.res.statusCode = 200;
        this._body = value;
    },
    set status(code) {
        this.res.statusCode = code;
    },
    set type(type) {
        this.res.setHeader('Content-Type', type);
    },
    get body(){
        return this._body;
    }
}

module.exports = response;