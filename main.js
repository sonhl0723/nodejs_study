var http = require('http');
var fs = require('fs');

// url이라는 모듈을 사용 할 것이다.
var url = require('url');

function templateHTML(title, list, body){
  return `
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
            ${body}
          </body>
          </html>
          `;
}

function templateList(filelist){
  var list = `<ul>`;

  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">
    ${filelist[i]} </a></li>`;
    i = i + 1;
  }
  
  list = list + `</ul>`;

  return list
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryDate = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryDate.id === undefined){

        fs.readdir('./data', function(err, filelist){
          var list = templateList(filelist);
          var title = 'Welcome';
          var description = 'Hello';
          var template = templateHTML(title, list, `${description}`);
          
          response.writeHead(200);
          response.end(template);
        })
      }
      else{
        fs.readdir('./data', function(err, filelist){
          var list = templateList(filelist);
          
          fs.readFile(`data/${queryDate.id}`, 'utf8', function(err, data){
            var title = queryDate.id;
            var description = data;
            var template = templateHTML(title, list, `${description}`);
      
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