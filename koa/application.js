const http = require('http');
const Emitter = require('events');

let context = require('./context');
let request = require('./request');
let response = require('./response');

class Koa extends Emitter{
    constructor(){
        super();
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
        context.app = this;
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
            try{
                return Promise.resolve(mid(ctx, ()=> dispatch(index + 1)))
            }catch(err){
                return Promise.reject(err)
            }
        }
        return dispatch(0);
    }

    // 没有使用 app.on('error') 时，进入此处默认预置一些错误
    onerror(err){
        //非原生错误拦截掉，否则会正常启动服务 app.onerror('some error')
        const isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
        if (!isNativeError){
            throw new TypeError('non-error thrown: ' + err)
        };

        // 原生错误输入日志提示
        const msg = err.stack || err.toString();
        console.error(`\n${msg.replace(/^/gm, '  ')}\n`);
    }

    handleRequest(req, res) {
        res.statusCode = 404;
        let ctx = this.createContext(req, res);
        const onerror = err => ctx.onerror(err);
        let composeMiddleware = this.compose(ctx, this.middlewares); //执行后ctx.body会被修改
        //等待异步完成
        composeMiddleware.then(()=>{
            let body = ctx.body;
            if(typeof body === 'undefined'){
                res.end('Not Found')
            }else if(typeof body == 'string'){
                res.end(body)
            }
        }).catch(onerror)
    }
    listen(...arg){
        let server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arg)
    }
}

module.exports = Koa;