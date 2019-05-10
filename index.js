(async () => {
    const YouZhanController = require('./app/controllers/YouZhanController')
    const youZhanController = new YouZhanController()
    const FileDownloadController= require('./app/controllers/FileDownloadController')
    const fileDownloadController = new FileDownloadController()
    // await youZhanController.index()
    await fileDownloadController.download()
})()