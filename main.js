var http = require('http'); //라이브러리 참조
var fs = require('fs'); //파일시스템 라이브러리 참조
var url = require('url'); //url모듈 참조

var app = http.createServer(function(req, res){ //createServer 메소드로 서버생성 req:클라이언트가 서버에 요청하는 객체 /// res:서버가 클라이언트에 응답하는 개체
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    if(_url == '/'){
      title = 'Web';
    }
    if(_url == '/favicon.ico'){
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){
      var template = `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        <style media="screen">
          .select{
            font-size: 30px;
            font-weight: 100;
          }
          .explain{
            font-size: 20px;
            font-weight: 100;
          }
          a{
            text-decoration: none;
            color: inherit;
          }
        </style>
      </head>

      <body>
        <div class="select">
          <h1><a href="/">WEB</a></h1>
          <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ol>
        </div>
        <div class="explain">
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
      </body>
      </html>
      `;
      res.end(template);
    });
});
app.listen(3000); //listem 메소드는 서버에서 클라이언의 접속을 기다리는 명령어
console.log("서버가 작동합니다.");
