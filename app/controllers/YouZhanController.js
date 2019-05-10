const cheerio = require('cheerio')
const http = require('http')
const BASE_DOMAIN = 'http://www.youzhan.org'
const redis = require('../libs/redis')
const config = require('../config')
class YouZhanController {
    constructor() {}
    async index() {
        const totalPage = await this.getTotalPage()
        for (let page = 1; page <= totalPage; page++) {
            await this.spiderHandlerByPage(page)
        }
        await redis.quit()
    }

    async getTotalPage() {
        const url = BASE_DOMAIN
        const html = await this.get(url)
        let totalPage = 0
        if (!!html) {
            const $ = cheerio.load(html)
            const reg = /[1-9][0-9]*/g
            const pagination = $('nav.pagination').find('span.page-number').text()
            const matches = pagination.match(reg)
            if (matches.length >= 2) {
                totalPage = matches[1]
            }
        }
        return totalPage
    }

    async spiderHandlerByPage(page) {
        let url = BASE_DOMAIN
        if (page != 1) {
            url += `/page/${page}/`
        }
        const html = await this.get(url)
        if (!!html) {
            const $ = cheerio.load(html)
            $('article.post').each(async (i, e) => {
                const item = {
                    title: $(e).children('h2').children('a').text(),
                    href: $(e).children('h2').children('a').attr('href'),
                    thumb: $(e).children('div').children('a').children('img').attr('src'),
                }
                if (item.href[0] == '/') {
                    item.href = BASE_DOMAIN + item.href
                }
                await redis.lpush(config.cache.CACHE_YOUZHAN_ITEMS_LIST, JSON.stringify(item))
            })
        }
    }
    async get(url) {
        return await new Promise((resolve, reject) => {
            http.get(url, (res => {
                if (res.statusCode != 200) {
                    console.log(res.statusCode)

                    reject(false)
                }
                let body = ''
                res.on('data', chunk => {
                    body += chunk
                })
                res.on('end', () => {
                    resolve(body)
                })
            }))
        }).catch(err => {
            console.log(err)
            return false
        })
    }
}
module.exports = YouZhanController