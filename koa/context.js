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

let proto = {}

new Delegator(proto, 'request')
    .getters('url')
    .getters('path')

new Delegator(proto, 'response')
    .getters('body')
    .setters('body')

module.exports = proto;
