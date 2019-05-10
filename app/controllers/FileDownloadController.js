const path = require('path')
const config = require('../config')
const redis = require('../libs/redis')

const {
    file
} = require('siwi-file')

class FileDownloadController {
    constructor() {}
    async download() {
        while (true) {
            const itemStr = await redis.rpop(config.cache.CACHE_YOUZHAN_ITEMS_LIST)
            if (!!itemStr) {
                const {
                    title,
                    href,
                    thumb
                } = JSON.parse(itemStr)
                const savePath = path.resolve('storage', 'images', `${title}.jpg`)
                try {
                    await file(thumb.replace('!md', ''), savePath)
                } catch (error) {
                    console.error(error)
                }
                
            } else {
                console.log('done!');
                await redis.quit()
                return false
            }
        }
    }
}

module.exports = FileDownloadController