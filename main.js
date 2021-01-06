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

        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello';
          var list = `<ul>`;

          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">
            ${filelist[i]} </a></li>`;
            i = i + 1;
          }
          
          list = list + `</ul>`;

          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            ${description}
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        })
      }
      else{
        fs.readdir('./data', function(err, filelist){
          var list = `<ul>`;
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">
            ${filelist[i]} </a></li>`;
            i = i + 1;
          }
          
          list = list + `</ul>`;
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
              ${list}
              <h2>${title}</h2>
              ${description}
            </body>
            </html>
                `;
            response.writeHead(200);
            response.end(template);
          });
        });
      }
      }
      else{
        response.writeHead(404);
        response.end('Not found');
      }
 
});
app.listen(3001);