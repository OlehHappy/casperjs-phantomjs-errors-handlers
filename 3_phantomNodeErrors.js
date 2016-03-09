var phantom = require('phantom');

phantom.create(function (ph) {
  ph.createPage(function (page) {
    // Put the event handlers somewhere in the code before the action of
    // interest (opening the page in question or clicking something)
    // See https://github.com/sgentle/phantomjs-node#functionality-details for proper use of callbacks

    // http://phantomjs.org/api/webpage/handler/on-console-message.html
    page.set('onConsoleMessage', function(msg, lineNum, sourceId) {
      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    });

    // http://phantomjs.org/api/webpage/handler/on-error.html
    page.set('onError', function(msg, trace) {
      var msgStack = ['ERROR: ' + msg];
      if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
      }

      console.error(msgStack.join('\n'));
    });

    // http://phantomjs.org/api/webpage/handler/on-resource-error.html
    page.set('onResourceError', function(resourceError) {
      console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
      console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
    });

    // http://phantomjs.org/api/webpage/handler/on-resource-timeout.html
    page.set('onResourceTimeout', function(request) {
        console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
    });
    page.open("https://www.google.com", function (status) {
      console.log("opened google? ", status);
      page.evaluate(function () { return document.title; }, function (result) {
        console.log('Page title is ' + result);
        ph.exit();
      });
    });
  });
}, /* on Windows only: */ {
  dnodeOpts: {
    weak: false
  }
});
