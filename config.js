/* global process */
module.exports = {
	"db": {
			"postgres": 'postgres://localhost:5432/spending_tracker_development'
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
			"spending": [ {"cost": 19.99, "category": 'Food', "location": 'TV', "date": '2015-12-01'},
										{"cost": 1.99, "category": 'Food', "location": 'Kroger', "date": '2015-11-15'},
										{"cost": 530.00, "category": 'Rent', "location": 'Commons On Kinnear', "date": '2015-12-01'},
										{"cost": 10.95, "category": 'Entertainment', "location": 'Arcade', "date": '2015-11-03'},
										{"cost": 100.23, "category": 'Utilities', "location": 'AEP Ohio', "date": '2015-10-01'}
									]
		},
		"filerDates": {
			"from": '2015-11-10',
			"to": '2015-12-02',
			"expect": 3
		}
	}
};
