var page = require('webpage').create(),
    url = 'http://example.com/';

// Put the event handlers somewhere in the code before the action of
// interest (opening the page in question or clicking something)

// http://phantomjs.org/api/webpage/handler/on-console-message.html
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

// http://phantomjs.org/api/webpage/handler/on-error.html
page.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));
};

// http://phantomjs.org/api/webpage/handler/on-resource-error.html
page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};

// http://phantomjs.org/api/webpage/handler/on-resource-timeout.html
page.onResourceTimeout = function(request) {
    console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
};

// use other helpful event handlers to debug the page behavior are:
//   onNavigationRequested
//   onResourceReceived
//   onResourceRequested
//   onUrlChanged

page.open(url, function(status) {
  console.log('Status: ' + status);
  phantom.exit();
});
