const http = require('http')
const url = require('url')
const port = 3000
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url2 = 'mongodb://localhost:27017/location';

	
const requestHandler = (request, response) => {  

  var url_parts = url.parse(request.url,true);
  var query = url_parts.query;
  
  MongoClient.connect(url2, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");
		
		insertDocument(db,query,function(){
			db.close();
		});
	});
	
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

var insertDocument = function(db,q,callback) {

	var collection = db.collection('documents');
	
	collection.insertOne(q,function(err,result){
		assert.equal(err,null);
		console.log("Inserted query");
		callback();
	});
}

