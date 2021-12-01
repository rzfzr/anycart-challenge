import puppeteer from 'puppeteer';

//todo: move these safeFunctions to decorators, same with logging and delay functions
async function safeClick(page, selector) {
    console.log('safeClick', selector);
    await page.waitForSelector(selector) //todo: handle timeout instead of try catch
    console.log('Found')
    await page.click(selector)
    console.log('Clicked', selector)
    return
}
// cant reuse safeClick because of context change
async function safeClickMultiple(page, selector) { //todo: actually be 'safe'
    console.log('safeClickMultiple', selector);
    await page.$$eval(selector, (links) => {
        links.forEach(link => link.click())
    })
    console.log('Clicked Multiple')
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
    await safeClick(page, '[href="/select-shop"]') //could have used /select-shop path and skipped the steps above
    await safeType(page, '[data-testid="address-l1-autocomplete"]', '94306')
    await safeClick(page, '[data-testid="address-list-item"]')
    await safeClick(page, '[data-testid="select-shop-partner"]')


    await scrollBottom(page)
    //todo: add failsafe when less than $30
    await safeClickMultiple(page, 'li.app-craft-item-interactive .qty-btn.__add');

    await page.waitForTimeout(1000);
    await safeClick(page, '[class="top-nav-item cart-item __has-items"]')


    await safeClick(page, 'button.ch-o-btn')


    // todo: check if 'staples' modal actually opens
    // todo: find a better indentifier
    await safeClick(page, '[class="anycart-btn btn-med btn-branding-color btn-font-normal"]')
    // class="place-order-button anycart-btn btn-branding-color disabled btn-font-big btn-med"
    //class="payment-button-container place-order-button anycart-btn btn-branding-color btn-font-big-bold btn-med"


})();