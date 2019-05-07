const Koa = require('koa2');
const app = new Koa();
const path = require('path');
const serve = require('koa-static');
const router = require("koa2-router")()
app.use(serve(path.join(__dirname + "/build")));
// router.get("/", (req, res) => {
//   //res.sendFile(serve(path.join(__dirname + "/build")));
//   console.log(res)
// })
// app.use(router)
app.listen(3000);