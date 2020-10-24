exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (con.userLib.checkAccess('org', req.session.auth)) {res.render('errorAccess');return;}

	let data, dates = [];
	if (req.session.auth.studID)
		data = await con.promise().query('SELECT category.name as catName, companies.*, request.* FROM request LEFT JOIN companies using(compID) LEFT JOIN category using(catID) WHERE who = 1 AND studID = ?', [req.session.auth.studID]);
	else {
		data = await con.promise().query('SELECT category.catID, category.name as catName, ncfu.*, request.* FROM request LEFT JOIN ncfu using(studID) LEFT JOIN category using(catID) WHERE who = 0 AND compID = ? ORDER BY statID', [req.session.auth.compID]);
		if (data[0].length) {
			dates = await con.promise().query('SELECT * FROM date WHERE beginDate > now() AND stGroup IN (?)', [data[0].map(el => el.stGroup).filter((el, ind, arr) => arr.indexOf(el) === ind)]);
			dates = dates[0];
		}
		// console.log(dates);
	}

	data = data[0];
	// console.log(data);

	res.render('request', {userType: con.userLib.userType(req.session.auth), user: req.session, data, dates});
};

//Выборка не отвеченных заявок

exports.path = '/request';