import fs from 'fs/promises';
import module from 'module';
import puppeteer from 'puppeteer'

(async () => {
    // ページの情報を取得
    const url = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E7%8C%AB';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // urlとテキストを取得(page.evaluate()を使用する。DOMの要素をブラウザから直接渡せないため、数値や文字列、配列、オブジェクトにして渡す)
    const arrayLinks = await page.evaluate(() => {
        const arrayLinks = Array.from(document.querySelectorAll('a'))
            .filter(element => element.href.match(/\/wiki\//))
            .filter(element => element.textContent !== '')
            .map(element => {
                const obj = {
                    text: element.textContent,
                    url: element.href
                };

                return obj;
            })
        return arrayLinks;
    });

    const pageLinks = 'output/links.txt';
    const textLinks = JSON.stringify(arrayLinks, null, '\t');
    await fs.writeFile(pageLinks, textLinks, 'utf8');

    // 画像を取得(page.$$(セレクター)を使用。セレクターで指定した要素を得ることができる。page.$$(セレクター)は「document.querySelectorAll」に相当する)
    let arrayImageA = await page.$$('a');
    for(let i = 0; i < arrayImageA.length; i++) {
        const prop = await arrayImageA[i].getProperty('href');
        arrayImageA[i] = await prop.jsonValue();
    }

    arrayImageA = arrayImageA
        .filter(url => url.match(/\.(jpg|png|gif)$/i));

    arrayImageA = Array.from(new Set(arrayImageA));

    const pathImageA = 'output/Images-a.txt';
    const textImagesA = JSON.stringify(arrayImageA, null, '\t');
    await fs.writeFile(pathImageA, textImagesA, 'utf8');

    // imgタグから画像一覧を作成して保存(page.$$eval(セレクター, 関数)を使用。取得した要素、もしくは要素の配列を関数で処理することができる)
    const arrayImagesImg = await page.$$eval('img', arr => {
        return arr.map(element => element.src);
    });

    const pathImagesImg = 'output/images-img.txt';
    const textImagesImg = JSON.stringify(arrayImagesImg, null, '\t');
    await fs.writeFile(pathImagesImg, textImagesImg, 'utf8');

    await browser.close();

})();