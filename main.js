var http = require('http');
var fs = require('fs');

// url이라는 모듈을 사용 할 것이다.
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryDate = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // var title = queryDate.id;

    if(pathname === '/'){
      if(queryDate.id === undefined){
        fs.readFile(`data/${queryDate.id}`, 'utf8', function(err, data){
          var title = 'Welcome';
          var description = 'Hello';
    
          var template = `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="?id=HTML">HTML</a></li>
        <li><a href="?id=CSS">CSS</a></li>
        <li><a href="?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      ${description}
    </body>
    </html>
        `;
        response.writeHead(200);
        response.end(template);
        });
      }
      else{
        fs.readFile(`data/${queryDate.id}`, 'utf8', function(err, data){
          var title = queryDate.id;
          var description = data;
    
          var template = `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="?id=HTML">HTML</a></li>
        <li><a href="?id=CSS">CSS</a></li>
        <li><a href="?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      ${description}
    </body>
    </html>
        `;
        response.writeHead(200);
        response.end(template);
        });
      }
      }
      else{
        response.writeHead(404);
        response.end('Not found');
      }
 
});
app.listen(3001);