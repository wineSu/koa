class Delegator{
    constructor(proto, target){
        this.proto = proto;
        this.target = target;
    }

    getters(name) {
        let { proto, target }  = this;
        Object.defineProperty(proto, name, {
            get() {
                return this[target][name];
            },
            configurable: true
          });
        return this;
    }

    setters(name) {
        let { proto, target }  = this;
        Object.defineProperty(proto, name, {
            set(v) {
                this[target][name] = v;
            },
            configurable: true
        });
        return this;
    }
}

let proto = {
    throw(...arg){
        const err = new Error();
        err.status = arg[0];
        err.message = arg[1];
        throw err;
    },
    onerror(err) {
        if (null == err) return;
       
        this.app.emit('error', err, this);
    
        const { res } = this;
        if (typeof res.getHeaderNames === 'function') {
            res.getHeaderNames().forEach(name => res.removeHeader(name));
        }
        
        // respond
        this.type = 'text/plain;charset=utf-8';
        this.status = err.status;
        res.end(err.message);
    }
}

new Delegator(proto, 'request')
    .getters('url')
    .getters('path')

new Delegator(proto, 'response')
    .getters('body')
    .setters('body')
    .setters('type')
    .setters('status')

module.exports = proto;
