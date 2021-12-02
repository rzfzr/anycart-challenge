import puppeteer from 'puppeteer';

function getCustomTime() {
    let date = new Date()
    return date.getHours() + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2)
}

async function shoot(page, selector) {
    await page.screenshot({
        path: './screenshots/' + getCustomTime() + '.png'
    });
}

export async function getBrowserPage(headless) {
    const browser = await puppeteer.launch({
        headless: headless, // headless mode give some errors but finishes without issues (Protocol error (Page.createIsolatedWorld): No frame for given id found)
        browserContext: "default",
        slowMo: 200,
    });
    const [page] = await browser.pages(); //reuses first tab
    await page.setDefaultNavigationTimeout(60000);
    await page.setViewport({
        width: 1600,
        height: 900
    })
    return {
        browser,
        page
    }
}

//todo: move these safeFunctions to decorators, same with logging and delay functions
export async function click(page, selector, multiple = false) {
    if (multiple) {
        await shoot(page)
        await page.$$eval(selector, (links) => {
            links.forEach((link) => {
                link.click()
            })
        })
    } else {
        await page.waitForSelector(selector) //todo: handle timeout instead of try catch
        await shoot(page, selector)
        await page.click(selector)
    }
}

export async function type(page, selector, message) {
    await page.waitForSelector(selector)
    await shoot(page, selector)
    await page.type(selector, message)
}

export async function scroll(page) { //todo: should scroll till selector is visible
    await page.evaluate(async () => {
        let scrollPosition = 0
        let documentHeight = document.body.scrollHeight

        while (documentHeight > scrollPosition) {
            window.scrollBy(0, documentHeight)
            await new Promise(resolve => {
                setTimeout(resolve, 1250)
            })
            scrollPosition = documentHeight
            documentHeight = document.body.scrollHeight
        }
    })
}
export async function goto(page, url) {
    await page.goto(url);
    await shoot(page)
}
export async function wait(page, selector, timeout) {
    await page.waitForSelector(selector, {
        timeout: timeout
    })
    await shoot(page)
}