import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

(async () => {
    // テキストを取得
    const dirDist = './download_files/'

    const pathHtml = path.resolve(dirDist, 'index.html')

    const urlHtml = 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E7%8C%AB';

    try {
        const response = await fetch(urlHtml);
        const html = await response.text();
        console.log('[Success] html.length:', html.length);

        await fs.writeFile(pathHtml, html, 'utf8')
    } catch(error) {
        console.log('[Error]', error);
    }

    // 画像を取得
    const pathImage = path.resolve(dirDist, 'save.jpg');

    const urlImage = 'https://upload.wikimedia.org/wikipedia/commons/3/35/Madaraneko_by_Takeuchi_Seiho.jpg';
    
    try {
        const response = await fetch(urlImage);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Buffer.from(arrayBuffer);
        console.log('[Success]buffer.byteLength:', buffer.byteLength);

        await fs.writeFile(pathImage, buffer);
    } catch(error) {
        console.log('[Error]', error);
    }
})();