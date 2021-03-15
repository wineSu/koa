function routerTolowercase(ctx){
  console.log(ctx.path, 111111111)
}
  
module.exports = function(){
  return async function(ctx,next){
    routerTolowercase(ctx)
    await next()
  }
}