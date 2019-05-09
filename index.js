(async () => {
    const YouZhanController = require('./app/controllers/YouZhanController')
    const youZhanController = new YouZhanController()

    await youZhanController.index()
})()