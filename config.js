module.exports = {
	"db": {
			"postgres": 'postgres://localhost:5432/user_spending'
		  },	
	"passport": {
			"secret": 'keyboard cat'
			},
	"server": {
			"port": 3000,
			"url": process.env.URL || "http://localhost:3000"
			},
	"test": {
		"user": {
			"username": 'testGuy',
			"password": 'testPassword',
			"id": "29",
			"spending": [ {"cost": 19.99, "category": 'Food', "location": 'TV', "date": '2015-12-01'}]
		}
	}
};