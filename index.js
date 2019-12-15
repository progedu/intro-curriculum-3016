'use strict';
const fs = require('fs');
const http = require('http');
const pug = require('pug');
const now = new Date();
const IPfileName = './IPAddress.json';
const resultxt = './result.csv';
let IPArray = [];
let resulArray = [];
try {
  const data = fs.readFileSync(IPfileName, 'utf8');
  IPArray = JSON.parse(data);
} catch (ignore) {
  console.log('復元できませんでした');
}
function saveIP() {
  fs.writeFileSync(IPfileName, JSON.stringify(IPArray), 'utf8');
}

function saveresult() {
  fs.writeFileSync(resultxt, JSON.stringify(resulArray), 'utf8');
}



const server = http.createServer((req, res) => {
  const fs = require('fs');



  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
for(var i = 0; i < IPArray.length; i++){
  if(IPArray[i] === req.connection.remoteAddress){
    return;
  }
}



  switch (req.method) {
    case 'GET':
      res.write(pug.renderFile('./form.pug'));
      res.end();
      
      break;
    case 'POST':
        
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        console.info(`${decoded}\n`);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          decoded + 'が投票されました</h1></body></html>');
          IPArray.push(req.connection.remoteAddress);
          resulArray.push(`${decoded}`);
          saveIP();
          saveresult();
        res.end();
      
      });
      break;
    default:
      break;
  }
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});