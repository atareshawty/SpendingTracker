function StaticPagesController() {
	this.home = function(req, res) {
    res.status(200).render('home');
	};
	
	this.get401 = function(req, res) {
		res.status(401).render('401');
	};
	
	this.about = function(req, res) {
		res.status(200).render('about');
	};
}

module.exports = StaticPagesController;