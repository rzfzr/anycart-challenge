import {
    getBrowserPage,
    click,
    type,
    scroll,
    goto,
    wait,
} from "./modules/safe-puppeteer.js"

export async function run(routine, headless = true, isShooting = false) {
    console.log('Routine Started')
    const {
        browser,
        page
    } = await getBrowserPage(headless)
    for await (const step of routine.steps) {
        console.log('Executing', step.action, step.data || '');
        switch (step.action) {
            case 'goto':
                for await (const element of step.data) {
                    await goto(page, element, isShooting)
                }
                break;
            case 'click':
                for await (const element of step.data) {
                    await click(page, element, false, isShooting)
                }
                break;
            case 'type':
                for await (const element of step.data) {
                    await type(page, element.selector, element.text, isShooting)
                }
                break;
            case 'scroll':
                await scroll(page)
                break;
            case 'clickAll':
                for await (const element of step.data) {
                    await click(page, element, true, isShooting)
                }
                break;
            case 'wait':
                for await (const element of step.data) {
                    await wait(page, element.selector, element.timeout, isShooting)
                }
                break;
            default:
                console.log(`Unknown action`);
        }
    }
    console.log('Routine Finished')
    await browser.close();
}