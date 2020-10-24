exports.func = (con, req, res) => {
	req.session.regenerate();
	res.redirect('/');
};

exports.path = '/logout';