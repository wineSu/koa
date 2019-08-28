let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Koa{
    constructor(){
        this.context = context;
        this.request = request;
        this.response = response;
        this.middlewares = [];
    }
    use(cb){
        //获取参入的函数
        // this.callbackFn = cb;
        this.middlewares.push(cb)
    }
    createContext(req, res){
        //ctx拿到contex属性  保证不会修改context
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.req = ctx.request.req = req;
        ctx.response = Object.create(this.response);
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    compose(ctx, middlewares){
        function dispatch(index){
            if(index === middlewares.length){
                //都执行完毕 
                return Promise.resolve();
            }
            let mid = middlewares[index];
            //递归 next 洋葱圈 
            return Promise.resolve(mid(ctx, ()=> dispatch(index + 1)))
        }
        return dispatch(0);
    }
    //use中回调
    handleRequest(req, res){
        res.statusCode = 404;
        let ctx = this.createContext(req, res)
        let composeMiddleware = this.compose(ctx, this.middlewares); //执行后ctx.body会被修改
        //等待异步完成
        composeMiddleware.then(()=>{
            let body = ctx.body;
            if(typeof body === 'undefined'){
                res.end('Not Found')
            }else if(typeof body == 'string'){
                res.end(body)
            }
        })
    }
    listen(){
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arguments)
    }
}

module.exports = Koa;