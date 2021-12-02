import puppeteer from 'puppeteer';

//todo: move these safeFunctions to decorators, same with logging and delay functions
async function click(page, selector) {
    console.log('safeClick', selector);
    await page.waitForSelector(selector) //todo: handle timeout instead of try catch
    // await page.waitForSelector(selector, {
    //     visible: true
    // })
    console.log('Found')
    await page.click(selector)
    console.log('Clicked', selector)
    return
}
// cant reuse safeClick because of context change
async function clickAll(page, selector) { //todo: actually be 'safe'
    console.log('safeClickMultiple', selector);
    await page.$$eval(selector, (links) => {
        links.forEach(link => link.click())
    })
    console.log('Clicked Multiple')
}
async function type(page, selector, message) {
    try {
        await page.type(selector, message)
    } catch (error) {
        await page.waitForSelector(selector)
        await page.type(selector, message)
    }
    return
}

async function scroll(page) { //todo: should scroll till selector is visible
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
async function goto(page, url) {
    await page.goto(url);
}
async function wait(page, selector, timeout) {
    await page.waitForSelector(selector, {
        timeout: timeout
    })
}
const routine = {
    name: "GetAllRecipes",
    creator: "rzfzr",
    steps: [{
            action: 'goto',
            data: ['https://anycart.com/']
        }, {
            action: 'click',
            data: ['[data-testid="modal-close"]', '[href="/select-shop"]']
            //could have used /select-shop path and skipped a few steps
        }, {
            action: 'type',
            data: [{
                selector: '[data-testid="address-l1-autocomplete"]',
                text: '94306'
            }]
        },
        {
            action: 'click',
            data: ['[data-testid="address-list-item"]', '[data-testid="select-shop-partner"]']
        }, {
            action: 'scroll'
        }, {
            action: 'clickAll',
            data: ['li.app-craft-item-interactive .qty-btn.__add']
        }, {
            action: 'click',
            data: ['[class="top-nav-item cart-item __has-items"]', '.cart-summary-top button', '.modal-sticky-bottom-bar button']
            // todo: check if 'staples' modal actually opens
        },
        {
            action: 'wait',
            data: [{
                selector: '.payment-button-container',
                timeout: 120000
            }]
        }
    ]
}


run(routine)

async function run(routine) {
    console.log('Routine Started')

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


    for await (const step of routine) {
        console.log('doing ', step.action);
        switch (step.action) {
            case 'goto':
                for await (const element of step.data) {
                    await goto(page, element)
                }
                break;
            case 'click':
                for await (const element of step.data) {
                    await click(page, element)
                }
                break;
            case 'type':
                for await (const element of step.data) {
                    await type(page, element.selector, element.text)
                }
                break;
            case 'scroll':
                await scroll(page)
                break;
            case 'clickAll':
                for await (const element of step.data) {
                    await clickAll(page, element)
                }
                break;
            case 'wait':
                for await (const element of step.data) {
                    await wait(page, element.selector, element.timeout)
                }
                break;
            default:
                console.log(`Unknown action`);
        }


    }

    // await page.waitForSelector('.payment-button-container', {
    //     timeout: 120000
    // })
    console.log('Routine Finished')
    await browser.close();
}