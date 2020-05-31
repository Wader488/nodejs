const http = require('http');
const requestHttp = require('request');
const {EventEmitter} = require('events');

let translate = "";
let toYandex = "";

class ya extends EventEmitter {
    start() {
        requestHttp(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200530T190258Z.558d3ba49fb5d8b5.1a1d8016c099d9e2c653f4010abb81b0e443f585&text=${toYandex}&lang=ru-en`, async (err, response, body) => {
            if(!err && response.statusCode === 200){  
                translate = body;
                this.emit('ok');
                };
            });
    }
}

http.createServer((request, response) =>{

if (request.url !== '/favicon.ico'){
    toYandex = request.url.slice(1);
    let y = new ya();
    y.start();
    y.on('ok', () => {
        response.writeHead(200,{
            'Content-Type': 'text/html; charset=utf-8',
        });
        let answer = translate.slice((translate.indexOf('text')) + 8, -3);
        response.write(`<p>Запрос: ${decodeURI(toYandex)}</p>`);
        response.write(`<p>Перевод: ${answer}</p>`);
        response.end();
    })  
}
}).listen(8080);