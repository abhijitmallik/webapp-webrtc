// author: Abhijit Mallik

var loadEndpoints = function(server) {
    require('./connection').load(server);
};

module.exports = {
    provideServices: loadEndpoints
};