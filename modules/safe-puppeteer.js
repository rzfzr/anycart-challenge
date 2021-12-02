import puppeteer from 'puppeteer';

export async function getBrowserPage() {
    // @logger //gave up
    const browser = await puppeteer.launch({
        headless: false, // headless mode give some errors but finishes without issues (Protocol error (Page.createIsolatedWorld): No frame for given id found)
        browserContext: "default",
        slowMo: 200,
    });
    const page = await browser.newPage();
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
        await page.$$eval(selector, (links) => {
            links.forEach(link => link.click())
        })
    }
    await page.waitForSelector(selector) //todo: handle timeout instead of try catch
    await page.click(selector)
}

export async function type(page, selector, message) {
    try {
        await page.type(selector, message)
    } catch (error) {
        await page.waitForSelector(selector)
        await page.type(selector, message)
    }
    return
}

export async function scroll(page) { //todo: should scroll till selector is visible
    await page.evaluate(async () => {
        let scrollPosition = 0
        let documentHeight = document.body.scrollHeight

        while (documentHeight > scrollPosition) {
            window.scrollBy(0, documentHeight)
            await new Promise(resolve => {
                setTimeout(resolve, 1200)
            })
            scrollPosition = documentHeight
            documentHeight = document.body.scrollHeight
        }
    })
}
export async function goto(page, url) {
    await page.goto(url);
}
export async function wait(page, selector, timeout) {
    await page.waitForSelector(selector, {
        timeout: timeout
    })
}