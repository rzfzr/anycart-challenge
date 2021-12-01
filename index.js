import puppeteer from 'puppeteer';

async function safeClick(page, selector) {
    await page.waitForSelector(selector) //todo: handle timeout
    await page.click(selector)
    return
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
    // await page.waitForTimeout(5000);
    // page.waitForSelector('[data-testid="modal-close"]', {
    //     visible: true
    // })

    // const el = await page.$('document.querySelector("body > div.home-template.app-has-sidebar.app--has-header.app-has-sidebar--hamburger-menu-is-closed.app-has-sidebar--is-open > section > div > div > div.app-promo-onboarding-modal.generic-modal > div > span > div > div.right-section > div > button")')
    // await page.click('document.querySelector("body > div.home-template.app-has-sidebar.app--has-header.app-has-sidebar--hamburger-menu-is-closed.app-has-sidebar--is-open > section > div > div > div.app-promo-onboarding-modal.generic-modal > div > span > div > div.right-section > div > button")')
    // await page.screenshot({
    //     path: 'example.png'
    // });

    // await browser.close();
})();