import fs from "fs"
import {
    program
} from 'commander';

import * as bot from './index.js';

const routine0 = JSON.parse(fs.readFileSync('./routines/0.json'))

program
    .version('0.0.1')
    .description("anybot, Anycart's code challenge")
program
    .command('run')
    .alias('r')
    .description('Execute default routine (headlessly)')
    .action(() => {
        bot.run(routine0)
    })
program
    .command('headful')
    .alias('h')
    .description('Execute default routine, disables headless (showing browser and actions)')
    .action(() => {
        bot.run(routine0, false)
    })
// program
//     .command('log')
//     .alias('l')
//     .description('Execute default routine, but picture logging into /screenshots/')
//     .action(() => {
//         bot.run(routine0, false)
//     })
program.parse(process.argv)