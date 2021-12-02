import fs from "fs"
import {
    getNewPage,
    click,
    clickAll,
    type,
    scroll,
    goto,
    wait,
} from "./modules/safe-puppeteer.js"

async function run(routine) {
    console.log('Routine Started')
    const page = getNewPage
    for await (const step of routine.steps) {
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
    console.log('Routine Finished')
    await browser.close();
}

run(JSON.parse(fs.readFileSync('./routines/0.json')))