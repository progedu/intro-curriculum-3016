'use strict';
const http = require('http');
const jade = require('jade');
const server = http.createServer((req, res) => {
  console.info('Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/omu-han') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'オムライス',
          secondItem: 'ハンバーグ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピザ'
        }));
      } else if (req.url === '/') {
        res.write('<!DOCTYPE html><html lang="ja"><body><h1><a href="/enquetes/omu-han">オムライスorハンバーグ</a><br><a href="/enquetes/rice-bread">ごはんorパン</a><br><a href="/enquetes/sushi-pizza">寿司orピザ</a><br></h1></body></html>')
      }
      res.end();
      break;
    case 'POST':
      req.on('data', (data) => {
        const decoded = decodeURIComponent(data);
        console.info('投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"></head><body><h1>' +
          decoded + 'が食べたいようです</h1></body></html>');
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