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
        this.middlewares.push(cb);
        return this;
    }

    createContext(req, res){
        // 多个示例 避免数据共享
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);

        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    compose(ctx, middlewares){
        let dispatch = (index) => {
            if(index === middlewares.length){
                return Promise.resolve();
            }
            let mid = middlewares[index];
            // next  
            return Promise.resolve(mid(ctx, ()=> dispatch(index + 1)))
        }
        return dispatch(0);
    }
    
    handleRequest(req, res) {
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
    listen(...arg){
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arg)
    }
}

module.exports = Koa;