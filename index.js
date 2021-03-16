// let Koa = require('./koa/application');
// let middleRouter = require('./middle')
// let app = new Koa();

// let log = ()=>{
//     return new Promise((resolve)=>{
//         setTimeout(()=>{
//             console.log(2222222222222)
//             resolve()
//         },1000)
//     })
// }

// console.log(app.on, 11111111111)

// app.use(async (ctx, next) =>{
//     console.log(1)
//     await log()
//     next()
//     console.log(2)
// })

// app.use(middleRouter())

// app.use(async (ctx, next) =>{
//     console.log(3)
//     ctx.response.type = 'text/html';
//     ctx.response.body = '<h1>Hello, koa2!</h1>';
//     next()
//     await log()
//     console.log(4)
// })

// app.listen(3000);

let Koa = require('./koa/application');
let app = new Koa();


app.use(async (ctx, next)=>{
    ctx.throw(405, '这个用户太小了， 找不到')
    // new Promise(() => {
    //     throw new Error(111111111111)
    // })
    // throw Eroor(1111111111)
    // str *= 100
    await next()
})
// app.onerror(err)
app.on("error",(err,ctx)=>{//捕获异常记录错误日志
    console.log(new Date(),":--------------",err);
});
  
app.listen(3000);
