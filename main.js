var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title,list,body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB2 - ${title}</title>
    <meta charset="utf-8">
    <style media="screen">
      body{
        font-size: 30px;
      }
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
      .delete{
        border: 5px;
        font-size: 20px;
        font-weight: 100;
        color: red;
      }
    </style>
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}
function templateLIST(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += '</ul>';
  return list;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateLIST(filelist);
          var template = templateHTML(title,list,
            `<h2>${title}</h2>${description}`,
            `<a style="color:blue;" href="/create">CREATE</a>`
          );
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateLIST(filelist);
            var template = templateHTML(title,list,
              `<h2>${title}</h2>${description}`,
              `<a style="color:blue;"href="/create">CREATE</a>
               <a style="color:#fbbc05;"href="/update?id=${title}">UPDATE</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input class="delete" type="submit" value = "[DELETE]">
                </form>
              `
            );
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'Web-create';
        var list = templateLIST(filelist);
        var template = templateHTML(title,list,`
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
          `,'');
        response.writeHead(200);
        response.end(template);
      })
    } else if(pathname === '/create_process'){
        var body ='';
        request.on('data', function(data){
          body += data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`,description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('success');
          });
        });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateLIST(filelist);
          var template = templateHTML(title,list,
            `
            <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value = "${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit" value="SUBMIT">
            </p>
          </form>
            `,
            `<a style="color:blue;" href="/create">CREATE</a>
             <a style="color:#fbbc05;" href="/update?id=${title}">UPDATE</a>
             `
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if(pathname === '/update_process'){
      var body ='';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(error){
          fs.writeFile(`data/${title}`,description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        })
      });
    } else if(pathname === '/delete_process'){
      var body ='';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
console.log('서버가 작동합니다.');
