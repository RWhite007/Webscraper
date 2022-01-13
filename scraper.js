
const puppeteer = require('puppeteer');
const myUrl = 'https://www.newegg.com/msi-geforce-rtx-3080-rtx-3080-ventus-3x-10g/p/N82E16814137600';
const {Client, Intents} = require('discord.js');
const config = require('./config.json'); //Discord bot token

const client = new Client({  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]  });

   
async function webScraper(url) {
   
    while (true) {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(url);
                                          //Uses Xpath of ' OUT OF STOCK' text
    const [el] = await page.$x('//*[@id="app"]/div[3]/div[1]/div/div/div[2]/div[1]/div[5]/div[2]/div/strong/text()'); 
    const txt = await el.getProperty('textContent');
    const rawTxt = await txt.jsonValue();
    

    if (rawTxt === ' OUT OF STOCK.') { //When still sold out, waits 20-50 seconds before looping again
        console.log('Not in stock, checking again soon');
        await sleep ((Math.random() * 1000));  //pauses before closing browser
        browser.close();
        client.once('ready', () => {
            console.log('Discord client open and ready');
            const channel = client.channels.cache.get('929197937924407309').send(`3080 in stock!  Here's the link ${myUrl}`);
        });
        client.login(config.BOT_TOKEN);
        await sleep((Math.random() * 3000) + 4000);

    } else {  //else sleep for 1 hour before looping again
        console.log('GPU in stock!?');
        await sleep(3600000);
        
    }
}
    
}

function sleep (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

webScraper(myUrl);