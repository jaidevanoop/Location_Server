var redis = require('redis'),client = redis.createClient()

var geo = require('georedis').initialize(client)

const http = require('http')
const url = require('url')
const port = 3000

var people = geo.addSet('people')

const requestHandler = (request, response) => {  
	
	var url_parts = url.parse(request.url,true);

	var pathname = url_parts.pathname;
  
	var query = url_parts.query;
  	
  	var user = query.user;

	if( pathname == '/addUser'){
  
		var peopleLocation = {};
  	
		var loc = {};
		
		loc['latitude'] = query.lat;
		loc['longitude'] = query.lon;
  	
		peopleLocation[user] = loc;
  	
  		people.addLocations(peopleLocation, function(err, reply){
 			if(err) console.error(err)
  			else console.log('added people:', reply)
		})
	}
	else if( pathname == '/findUser'){
		
		var dist = query.dist;
		
		people.nearby(user, dist, function(err, locations){
	  		if(err) console.error(err)
			else console.log('nearby locations:', locations)

			/*var str = ""

			for( var id in locations){
				var data = locations[id]
				console.log(String(data))
				str += String(data)
				str += ","
				
			}

			console.log(str)

			response.end(str)*/
			
			for( var id in locations){
				var data = locations[id]
				data += '\n'
				response.write(data)				
			}
			response.end()
			
		})
  
	/*
		var options = {
		withCoordinates: true, // Will provide coordinates with locations, default false
		withHashes: true, // Will provide a 52bit Geohash Integer, default false
		withDistances: true, // Will provide distance from query, default false
		order: 'ASC', // or 'DESC' or true (same as 'ASC'), default false
		units: 'm', // or 'km', 'mi', 'ft', default 'm'
		count: 100, // Number of results to return, default undefined
		accurate: true // Useful if in emulated mode and accuracy is important, default false
		}
	*/
  
  
	}
	else if( pathname == '/removeUser'){
	
		people.removeLocation(user, function(err, reply){
			if(err) console.error(err)
			else console.log('removed location:', reply)
		})
  
	}
	else{
		console.log("Test")
	}
  
	//response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
	
	if (err) {
		return console.log('something bad happened', err)
	}

	console.log(`server is listening on ${port}`)
})
