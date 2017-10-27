'use strict';
const http = require('http');
const jade = require('jade');
const server = http.createServer((req, res) => {
	const now = new Date();
	console.info('Requested by ' + req.connection.remoteAddress);
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});//第一引数;ステータスコード 第二:その他のヘッダーとキー

	switch (req.method) {
		case 'GET':
/*			const fs = require('fs');
			const rs = fs.createReadStream('./form.html');
			rs.pipe(res);
			*/
			if(req.url === '/enquetes/yaki-shabu'){
			res.write(jade.renderFile('./form.jade', {
        path: req.url,
        firstItem: '焼き肉',
        secondItem: 'しゃぶしゃぶ'
      	}));
			}else if(req.url === '/enquetes/rice-bread'){
				res.write(jade.renderFile('./form.jade', {
					path: req.url,
					firstItem: 'ごはん',
					secondItem: 'パン'
				}));
			}
			res.end();
			break;
		case 'POST':
			req.on('data', (data) => {
				const decoded = decodeURIComponent(data);
				console.info('投稿: ' + decoded);
				res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>' +
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
const port = 8000;
server.listen(port, () => {
	console.info('Listening on ' + port);
});
