module.exports = {
  HTML:function(title, list, body, control){
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
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
