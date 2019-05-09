const cheerio = require('cheerio')
const http = require('http')
const BASE_DOMAIN = 'http://www.youzhan.org'
class YouZhanController {
    constructor() {}
    async index() {
        const totalPage = await this.getTotalPage()
        for (let page = 1; page <= totalPage; page++) {
            await this.spiderHandlerByPage(page)
            if (page > 2) {
                break;
            }
        }
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
            const items = []
            $('article.post').each((i, e) => {
                const item = {
                    title: $(e).children('h2').children('a').text(),
                    href: $(e).children('h2').children('a').attr('href'),
                    thumb: $(e).children('div').children('a').children('img').attr('src'),
                }
                if (item.href[0] == '/') {
                    item.href = BASE_DOMAIN + item.href
                }
                items.push(item)
            })
            console.log(items);
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