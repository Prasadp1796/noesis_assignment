let request = require('request');


var urls =[
    {"url": "http://doesNotExist.boldtech.co","priority": 1},
   {"url": "http://boldtech.co/","priority": 7},
   {"url": "http://offline.boldtech.co", "priority": 2},
   {"url": "http://www.google.com","priority": 4},
   { "url": "http://www.google.com", "priority": 1},
   { "url": "http://stackoverflow.com", "priority": 1},
];
console.log(urls.length);


var async = require('async');

var requests = [];
console.time("Sent")
// Build a large list of requests:
for (i=0, k=1;i<urls.length;i++) {
    let options = {timeout: 5000, url: urls[i].url};
    requests.push(function(callback){
        request(options,function(err, res){
            if(!err)
            callback(null,res.statusCode);
        }).end()
    });
}

// Make the requests, 100 at a time
async.parallelLimit(requests, urls.length,function(err, results){
    // let rs = JSON.stringify(results);
     console.log(JSON.stringify(results));
    console.timeEnd("Sent");
});