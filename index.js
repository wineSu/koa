let Koa = require('./koa/application');
let middleRouter = require('./middle')
let app = new Koa();

let log = ()=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log(11111111111)
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

app.use((ctx, next) =>{
    console.log(3)
    next()
    console.log(4)
})

app.listen(3000);