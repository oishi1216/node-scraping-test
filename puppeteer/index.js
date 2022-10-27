import module from 'module';
import { Puppeteer } from 'puppeteer';

(async () => {

    const url = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E7%8C%AB';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    page.on('console', msg => {
        console.log('PAGE LOG:', msg.text())
    });

    await page.evaluate(() => {
        console.log(`url is ${location.href}`);
        console.log(`title is ${document.title}`);
    });

    await browser.close();
})();