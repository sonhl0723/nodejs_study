var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHTML = require('sanitize-html');

// url이라는 모듈을 사용 할 것이다.
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryDate = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryDate.id === undefined){

        fs.readdir('./data', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello';

          var list = template.list(filelist);
          var html = template.html(title, list, `${description}`,
          `<a href="/create">create</a>`);
          
          response.writeHead(200);
          response.end(html);
        })
      }
      else{
        fs.readdir('./data', function(err, filelist){
          var filterID = path.parse(queryDate.id).base;
          fs.readFile(`data/${filterID}`, 'utf8', function(err, data){
            var title = queryDate.id;
            var list = template.list(filelist);
            var description = data;

            var sanitizedTitle = sanitizeHTML(title);
            var sanitizedDescription = sanitizeHTML(description);

            var html = template.html(title, list, `${sanitizedDescription}`,
            `<a href="/create">create</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>
            `);
      
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }
    else if(pathname === '/create'){
      fs.readdir('./data', function(err, filelist){
        var list = template.list(filelist);
        var title = 'WEB - CREATE';
        var html = template.html(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
        `, '');
        
        response.writeHead(200);
        response.end(html);
      })
    }
    else if(pathname === '/create_process'){
        var body = '';

        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, `utf8`, function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
    }
    else if(pathname === `/update`){
      fs.readdir('./data', function(error, filelist){
        var list = template.list(filelist);
        var filterID = path.parse(queryDate.id).base;
        fs.readFile(`data/${filterID}`, 'utf8', function(err, data){
          var title = queryDate.id;
          var description = data;

          var sanitizedTitle = sanitizeHTML(title);
          var sanitizedDescription = sanitizeHTML(description);

          var html = template.html(title, list, `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <p><input type="text" name="title" value="${sanitizedTitle}"></p>
            <p>
                <textarea name="description">${sanitizedDescription}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>`);
    
          response.writeHead(200);
          response.end(html);
        });
      });
    }
    else if(pathname === '/update_process'){
      var body = '';

      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, `utf8`, function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        });
      });
    }
    else if(pathname === '/delete_process'){
      var body = '';

      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filterID = path.parse(id).base;
        fs.unlink(`data/${filterID}`, function(error){
          response.writeHead(302, {Location: `/` });
          response.end();
        });
      });
    }
    else{
      response.writeHead(404);
      response.end('Not found');
    }
 
});
app.listen(3001);