function StaticHandler() {
	this.getHome = function(req, res) {
		res.render('home');
	};
	
	this.get401 = function(req, res) {
		res.render('401');
	};
	
	this.getAbout = function(req, res) {
		res.render('about');
	};
}

module.exports = StaticHandler;