
const IndexController = require('../controllers/IndexController')
const indexController = new IndexController()

const Router = require('koa-router')
const router = new Router()

router.get('/', indexController.index)
router.get('/refresh')
module.exports = router
