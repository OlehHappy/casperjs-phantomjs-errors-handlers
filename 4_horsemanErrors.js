var Horseman = require('node-horseman');
var horseman = new Horseman();

horseman
  .on("consoleMessage", function(msg){
    console.log('CONSOLE: ' + msg);
  })
  .on("error", function(msg, trace){
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
      });
    }
    console.error(msgStack.join('\n'));
  })
  .on("resourceError", function(resourceError){
    console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
    console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
  })
  .on("resourceTimeout", function(request){
    console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
  })
  .open('http://www.google.com')
  .close();
