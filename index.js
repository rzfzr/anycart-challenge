import puppeteer from 'puppeteer';

//todo: move these safeFunctions to decorators, same with logging and delay functions
async function safeClick(page, selector) {
    try {
        await page.click(selector)
    } catch (error) {
        await page.waitForSelector(selector) //todo: handle timeout instead of try catch
        await page.click(selector)
    }
    return
}
async function safeType(page, selector, message) {
    try {
        await page.type(selector, message)
    } catch (error) {
        await page.waitForSelector(selector)
        await page.type(selector, message)
    }
    return
}

async function scrollBottom(page) {
    await page.evaluate(async () => {
        let scrollPosition = 0
        let documentHeight = document.body.scrollHeight

        while (documentHeight > scrollPosition) {
            window.scrollBy(0, documentHeight)
            await new Promise(resolve => {
                setTimeout(resolve, 1000)
            })
            scrollPosition = documentHeight
            documentHeight = document.body.scrollHeight
        }
    })
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 800
    })

    await page.goto('https://anycart.com/');
    await safeClick(page, '[data-testid="modal-close"]')
    await safeClick(page, '[class="artemis-btn --a"]') //could have used /select-shop path and skipped the steps above
    await safeType(page, '[data-testid="address-l1-autocomplete"]', '94306')
    await safeClick(page, '[data-testid="address-list-item"]')
    await safeClick(page, '[data-testid="select-shop-partner"]')

    await page.evaluate(() => {
        window.scrollTo(0, window.document.body.scrollHeight)
    });

    await scrollBottom(page)

    const children = await page.$$('[id="gallery-13"]');

    console.log("Result:", children);
    // await safeClick(page, '[id="gallery-13"]')

    // id="gallery-13"

    // qty-btn __add __initial
})();