'use strict';
const http = require('http');
const pug = require('pug');

function getParameter(req){
  let data = {path: req.url};
  switch(req.url){
    case '/enquetes/yaki-shabu':
      data.firstItem = '焼き肉';
      data.secondItem = 'しゃぶしゃぶ';
      break;
    
    case '/enquetes/rice-bread':
      data.firstItem = 'ごはん';
      data.secondItem = 'パン';
      break; 
      
    case '/enquetes/sushi-pizza':
      data.firstItem = '寿司';
      data.secondItem = 'ピザ';
      break;       
  }
  return data;
}

const server = http
  .createServer((req, res) => {
    console.info('Requested by ' + req.connection.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        
        let data = getParameter(req);
        res.write(pug.renderFile('./form.pug', data));
        

/*         if (req.url === '/enquetes/yaki-shabu') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '焼き肉',
              secondItem: 'しゃぶしゃぶ'
            })
          );
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: 'ごはん',
              secondItem: 'パン'
            })
          );
        } else if (req.url === '/enquetes/sushi-pizza') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '寿司',
            secondItem: 'ピザ'
          }));
        } */
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
  console.info('Listening on ' + port);
});
