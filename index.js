'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
    console.info('Requested by ' + req.connection.remoteAddress);
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });

      function resWrite(firstItem,secondItem){
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: firstItem,
          secondItem: secondItem
      }));
      res.end();
      }

    switch (req.method) {
        case 'GET':
            switch (req.url){
              case '/enquetes/yaki-shabu':
                resWrite("焼き肉","しゃぶしゃぶ");
                break;
              case '/enquetes/rice-bread':
                resWrite("コメ","パン");
                break;
              case '/enquetes/sushi-pizza':
                resWrite("寿司","ピザ");
                break;
              case '/':
                resWrite("PS4","XBOX0ne");
                break;
            }
            break;
        case 'POST':
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                const decoded = decodeURIComponent(body);
                console.info('投稿: ' + decoded);
                res.write('<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"></head><body><h1>' +
                    decoded + 'が投稿されました</h1></body></html>');
                res.end();
            });
            break;
        default:
            break;
    }

}).on('error', (e) => {
    console.error('Server Error', e);
}).on('clientError', (e) => {
    console.error('Client Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});