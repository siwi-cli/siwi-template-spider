const Koa = require('koa')
const app = new Koa()

// logger
const logger = require('koa-logger')
app.use(logger())

// body parser
const parser = require('koa-bodyparser')
app.use(parser())


// views
const views = require('koa-views')
app.use(views(`${__dirname}/views`, {
    extension: 'pug'
}))

// router
const router = require('./routes')
app.use(router.routes())
app.use(router.allowedMethods())
const [APP_NAME, APP_PORT] = ['SPIDER-MONITOR', 3010]
app.listen(`${APP_PORT}`, () => {
    console.log(`${APP_NAME} is starting at port ${APP_PORT}`)
})