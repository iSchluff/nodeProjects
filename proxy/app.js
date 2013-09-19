var httpProxy = require('http-proxy');

var options = {
  // this list is processed from top to bottom, so '.*' will go to
  // '127.0.0.1:3000' if the Host header hasn't previously matched
  router : {
    'gitlab.cookie-factory.de': '127.0.0.1:3001',
    '.*': '127.0.0.1:3000'
  }
};

// bind to port 80 on the specified IP address
httpProxy.createServer(options).listen(80, '46.38.232.239');
console.log('Proxy on Port 80');