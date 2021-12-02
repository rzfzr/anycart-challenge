# How to run 
```
npm install
node anybot -h
```
Developed under node 14.15.4 on W10, tested on a debian-based distro running node 16.13.1
# Design Decisions

I made many assumptions, whenever made false would require changes in the implementation, such as assuming that selecting elements by text would be an issue due to localization, and that time based delays would be inconvenient. I made delays long, sacrificing speed for stability.

I have used selenium in a single project in the past, a quick google search told me that puppeteer should be better for the wanted effect.
## Routines
I treated 'routines' like payloads, each .json inside ./routines would be one, containing all the steps for the bot, along with metadata about the routine itself such as name, creator, dates etc.
```yaml
{
   "name": "Sample routine",
   "creator": "a cool anycart employee",
   "steps": [
       {
           "action":"goto",
           "data":[
               "https://anycart.com/"
           ]
       }, 
       {
            "action": "click",
            "data": [
                "[data-testid=\"modal-close\"]",
                "[href=\"/select-shop\"]"
            ]
        },
   ]
}
```
Steps is a list of objects, every "step" must contain a string "action" and a list of strings "data".

Keeping the routine steps away from the implementation  would make it easier to maintain and create other plugin routines.

## Index.js's run()
The "run" function inside index.js is a simple switcher that receives a routine alongside options such as headless and logging, it would then parse the routine and execute the actions in order.
Every single call here must be synchronous, thus the repeated await everywhere, someone might prefer a long .then chain. The switchcase using string comparison is very hacky, something like TS's key/value structure or even a dict would be much neater, the temptation is to use the action value inside an eval(), passing data as spread parameters, making the code much smaller and readable, still, it should only be edited when creating actions.
## safe-puppeteer
The "run" function does not have direct access to the puppeteer, it gets my "safe-puppeter" functions, which are API-esque, a higher abstraction, the idea is to have all the boiler plate required for each function call in a single place. Such as error handling or waiting for elements to load before accessing them.
### Decorators
These custom functions are much messier than they need to be. The original idea was to use @functions, to inject higher order functions wrapping each of these calls, being able to toggle either they should log to console/file/screenshot etc.
## anybot.js
I used the commander package for creating quick selections such as:
```
node anybot run
node anybot headful
node anybot shoot
node anybot help
```
# Improvements
I haven't invested a lot of time here, but I have some suggestions:

## General
- A startup benchmark could judge connection speed, giving a value to be used in the delays, not only puppeteer's slomo setting, but waiting random +-x% between each action, in order to bypass bot-detection in other sites.
- There should be a failsafe for carts with less than $30, either by returning and adding more items, or by reading the value and not going to checkout in the first place.
- There should be a failsafe for carts that do not require any 'staple' items.
- Headful mode gives out an protocol error on the last waitForElement, does not affect anything but could be solved, might be a puppeteer's version issue, it non-blocking on windows.
- For some reason headful sometimes pull user focus to status bar.
## safe-puppeteer
- Most of these functions are not actually 'safe', each of them should have error handling, capable of either ignoring and going to the next step, or retrying the last action.

- The decorators are not officially supported, but should be able to get working, would make it much cleaner by not requiring the extra parameters such as isLogginging or function calls systemwide.
There could be a logging decorator, receiving options for verbose levels, logging to console and/or filesystem.

- shoot() should be able to receive the selector for the clicked or typed element, and highlight it, either injecting a border CSS into the webpage or by editing the actual image with the element's coordinates. The resulting images could have been better organized, maybe a directory for each routine run.

- scroll() should receive a selector, scrolling till it is visible, alongside with scroll direction.
## commander 
- Flags should not be exclusive, being able to choose both headless and logging for example.
## extras
- CLI progress bar.
- Each step in a routine could have a 'description' field, so that we could log it instead of the selectors.
- Errors should trigger a developer notification, as this should run mostly headless.
