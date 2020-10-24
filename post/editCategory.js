exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('back');return;}
	if (!con.userLib.checkAccess('comp', req.session.auth)) {res.render('errorAccess');return;}

	// console.log(req.body);

	for (let categoryID in req.body) {
		if (categoryID === 'directionCheckbox') continue;

		if (!+req.body[categoryID]) {
			con.query('DELETE FROM countmembers WHERE compID = ? AND catID = ?', [req.query.comp || req.session.auth.compID, categoryID]);
		} else
			con.query('INSERT INTO countmembers (compID, catID, count) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE count = ?', [req.query.comp || req.session.auth.compID, categoryID, req.body[categoryID], req.body[categoryID]], (e) => console.log(e));
	}

	res.redirect('/company/'+(req.query.comp || req.session.auth.compID));
};

exports.path = '/editcategory';