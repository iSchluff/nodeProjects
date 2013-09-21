var httpProxy = require('http-proxy');

var options = {
  // this list is processed from top to bottom, so '.*' will go to
  // '127.0.0.1:80' if the Host header hasn't previously matched
  router : {
    "experiments.cookie-factory.de": "127.0.0.1:80",
    "gitlab.cookie-factory.de": "127.0.0.1:3000",
    ".*": "127.0.0.1:80"
  }
};

// bind to port 80 on the specified IP address
try {
  var s=httpProxy.createServer(options).listen(9000);
  console.log('Proxy on Port 9000');
  s.on("error", function(err){
    console.log(err);
  })
}catch(exception){
  console.error(exception);
}

