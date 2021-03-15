class Delegator{
    constructor(proto, target){
        this.proto = proto;
        this.target = target;
    }

    getters(name) {
        let { proto, target }  = this;
        proto.__defineGetter__(name, function(){
            return this[target][name];
        });
        return this;
    }

    setters(name) {
        let { proto, target }  = this;
        proto.__defineSetter__(name, function(val){
            return this[target][name] = val;
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
