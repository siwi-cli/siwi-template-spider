class IndexController {
    constructor() {}
    async index(ctx, next) {
        return ctx.render('index')
    }
}

module.exports = IndexController