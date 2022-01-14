
const puppeteer = require('puppeteer');
const myUrl = 'https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-ventus-3x-10g/p/N82E16814137600';
const {Client, Intents} = require('discord.js');
const config = require('./config.json'); //Discord bot token

async function webScraper(url) {
   
    while (true) {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(url);
                                          //Uses Xpath of ' OUT OF STOCK' text
    const [el] = await page.$x('//*[@id="app"]/div[3]/div[1]/div/div/div[2]/div[1]/div[5]/div[2]/div/strong/text()'); 
    const txt = await el.getProperty('textContent');
    const rawTxt = await txt.jsonValue();
    

    if (rawTxt === ' OUT OF STOCK.') { 
        console.log('Not in stock, checking again soon');
        await sleep ((Math.random() * 1000));  //pauses before closing browser
        browser.close();
        await sleep((Math.random() * 30000) + 20000); //pases for 30-50 seconds before looping again

    } else {  
        console.log('GPU in stock!?');
        const client = new Client({  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]  }); 
        client.once('ready', () => {
            console.log('Discord client open and ready');
            const channel = client.channels.cache.get('channelIDGoesHere').send(`3080 in stock!  Here's the link ${myUrl}`);
            client.logout;
        });
        client.login(config.BOT_TOKEN);  
        await sleep(3600000); //1 hr pause till loop again
        }
}
}

function sleep (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

webScraper(myUrl);
