import puppeteer from 'puppeteer';

function getCustomTime() {
    let date = new Date()
    return date.getHours() + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2)
}

async function shoot(page, isShooting) {
    if (!isShooting) return
    await page.waitForTimeout(1000); //maybe only needed on my slow machine
    await page.screenshot({
        path: './screenshots/' + getCustomTime() + '.png'
    });
}

export async function getBrowserPage(headless) {
    const browser = await puppeteer.launch({
        headless: headless, // headless mode give some errors but finishes without issues (Protocol error (Page.createIsolatedWorld): No frame for given id found)
        browserContext: "default",
        slowMo: 300,
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
export async function click(page, selector, multiple = false, isShooting = false) {
    await shoot(page, isShooting)
    if (multiple) {
        await page.$$eval(selector, async (links) => {
            for await (const link of links) {
                await link.click()
            }
        })
    } else {
        await page.waitForSelector(selector)
        await page.click(selector)
    }
}

export async function type(page, selector, message, isShooting) {
    await page.waitForSelector(selector)
    await shoot(page, isShooting)
    await page.type(selector, message)
}

export async function scroll(page) {
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
export async function goto(page, url, isShooting) {
    await page.goto(url);
    await shoot(page, isShooting)
}
export async function wait(page, selector, timeout, isShooting) {
    await page.waitForSelector(selector, {
        timeout: timeout
    })
    await shoot(page, isShooting)
}