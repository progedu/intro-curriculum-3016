'use strict';
const http = require('http');
const jade = require('jade');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
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
      } else {
        res.write(jade.renderFile('./form.jade', {}));
      }
      res.end();
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const postArray = decoded.split('&');
        // postArrayの要素をname別の配列にする
        const favorite = [];
        const drink = [];
        const desserts = [];
        const name = [];
        postArray.forEach((val) => {
          if (val.indexOf('favorite') >= 0) {
            favorite.push(val.split('=')[1]);
          }
          if (val.indexOf('drink') >= 0) {
            drink.push(val.split('=')[1]);
          }
          if (val.indexOf('desserts') >= 0) {
            desserts.push(val.split('=')[1]);
          }
          if (val.indexOf('name') >= 0) {
            name.push(val.split('=')[1]);
          }
        });
        console.info('投稿: ' + decoded);
        res.write(jade.renderFile('./postResult.jade', {
          favorite: favorite,
          drink: drink,
          desserts: desserts,
          name: name
        }));
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
