const http = require('http');
const requestHttp = require ('request');
const cheerio = require ('cheerio');

let news ="";
requestHttp('https://www.tourdom.ru/', (err, response, body) => {
    if(!err && response.statusCode === 200){
       const $ = cheerio.load(body);
        news = $('.grid__sidebar').eq(1).html();     
    };
});

http.createServer((request, response) =>{
response.writeHead(200,{
    'Content-Type': 'text/html; charset=utf-8',
});
response.write(news);
response.end();
}).listen(8080);