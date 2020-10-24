exports.func = (con, req, res) => {
	if (req.session.auth) {
		if (req.session.auth.compID) {res.redirect('/company/' + req.session.auth.compID);return;}
		if (req.session.auth.studID) {res.redirect('/student/' + req.session.auth.studID);return;}
	}

	res.render('login', {userType: con.userLib.userType(req.session.auth), data: {}});
};

exports.path = '/login';