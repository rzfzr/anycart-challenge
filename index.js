import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();


    await page.goto('https://anycart.com/');

    await page.waitForTimeout(5000);

    await page.click('[data-testid="modal-close"]')


    // const el = await page.$('document.querySelector("body > div.home-template.app-has-sidebar.app--has-header.app-has-sidebar--hamburger-menu-is-closed.app-has-sidebar--is-open > section > div > div > div.app-promo-onboarding-modal.generic-modal > div > span > div > div.right-section > div > button")')
    // await page.click('document.querySelector("body > div.home-template.app-has-sidebar.app--has-header.app-has-sidebar--hamburger-menu-is-closed.app-has-sidebar--is-open > section > div > div > div.app-promo-onboarding-modal.generic-modal > div > span > div > div.right-section > div > button")')
    // await page.screenshot({
    //     path: 'example.png'
    // });

    // await browser.close();
})();