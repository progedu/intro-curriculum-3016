'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(`Requested by ${req.connection.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        let item1 = '';
        let item2 = '';
        if (req.url === '/enquetes/yaki-shabu') {
          item1 = '焼き肉';
          item2 = 'しゃぶしゃぶ';
        } else if (req.url === '/enquetes/rice-bread') {
          item1 = 'ごはん';
          item2 = 'パン';
        } else if (req.url === '/enquetes/sushi-pizza') {
          item1 = '寿司';
          item2 = 'ピザ';
        }
        res.write(
          pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: item1,
            secondItem: item2
          })
        );
      res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const qs = require('querystring');
            const answer = qs.parse(rawData);
            const body = answer['name'] + 'さんは' +
              answer['favorite'] + 'に投票しました';
            console.info(body);
            res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
              body + '</h1></body></html>');
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});
