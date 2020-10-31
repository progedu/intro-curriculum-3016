'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(' Requested by ' + req.connection.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        });
        const enquetes = {
          '/enquetes/yaki-shabu': ['焼き肉','しゃぶしゃぶ'],
          '/enquetes/rice-bread': ['ごはん','パン'],
          '/enquetes/sushi-pizza': ['寿司','ピッツァ']
        }
        if (enquetes[req.url]) {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: enquetes[req.url][0],
              secondItem: enquetes[req.url][1]
            })
          );
        } else {
          res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8'
          });
          const items = [];
          for (let enquete in enquetes) {
            items.push({
              path: enquete,
              firstItem: enquetes[enquete][0],
              secondItem: enquetes[enquete][1]
            });
          }
          res.write(
            pug.renderFile('./item.pug',{ items })
          );
        }
        res.end();
        break;
      case 'POST':
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        });
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
            console.info(' ' + body);
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
    console.error(' Server Error', e);
  })
  .on('clientError', e => {
    console.error(' Client Error', e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(' Listening on ' + port);
});
