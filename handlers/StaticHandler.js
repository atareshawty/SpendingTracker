function StaticHandler() {
	this.getHome = function(req, res) {
		res.status(200).render('home');
	};
	
	this.get401 = function(req, res) {
		res.status(200).render('401');
	};
	
	this.getAbout = function(req, res) {
		res.status(200).render('about');
	};
}

module.exports = StaticHandler;