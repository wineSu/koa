function routerTolowercase(ctx){
    //接受koa的请求实体 ctx
    // console.log(ctx.path.toLowerCase())
    console.log(ctx.path, 111111111)
  }
  
  module.exports = function(){
    return async function(ctx,next){
      routerTolowercase(ctx)
      await next()
    }
  }