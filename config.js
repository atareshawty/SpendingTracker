module.exports = {
  "db": {
    "postgres": process.env.SPENDING_TRACKER_DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development',
    "tables": ['login', 'spending', 'categories']
  },
  "passport": {
    "secret": 'keyboard cat'
  },
  "server": {
    "port": process.env.PORT || 3000
  },
  "test": {
    "user": {
      "username": 'testGuy',
      "id": 29,
			"spending": [ {"cost": 10023, "category": 'Utilities', "location": 'AEP Ohio', "date": '2015-10-01'},
                    {"cost": 1095, "category": 'Entertainment', "location": 'Arcade', "date": '2015-11-03'},
                    {"cost": 199, "category": 'Food', "location": 'Kroger', "date": '2015-11-15'},
                    {"cost": 1999, "category": 'Food', "location": 'TV', "date": '2015-12-01'},
										{"cost": 53000, "category": 'Rent', "location": 'Commons On Kinnear', "date": '2015-12-01'}																				
									],
      "categories": ['Food', 'Entertainment', 'Rent', 'Utilities', 'Gas', 'Clothing', 'Income'],
      "total": 66316
      },
    "filterDates": {
      "from": '2015-11-01',
      "to": '2015-11-16'
    },
    "filterSpending": [ {"cost": 1095, "category": 'Entertainment', "location": 'Arcade', "date": '2015-11-03'},
                        {"cost": 199, "category": 'Food', "location": 'Kroger', "date": '2015-11-15'}
                      ],
    "filteredTotal": 1294,
    "password": 'testPassword'
  }
};
