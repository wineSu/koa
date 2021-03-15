let Koa = require('./koa/application');
let middleRouter = require('./middle')
let app = new Koa();

let log = ()=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log(2222222222222)
            resolve()
        },1000)
    })
}

app.use(async (ctx, next) =>{
    console.log(1)
    await log()
    next()
    console.log(2)
})

app.use(middleRouter())

app.use(async (ctx, next) =>{
    console.log(3)
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
    next()
    await log()
    console.log(4)
})

app.listen(3000);