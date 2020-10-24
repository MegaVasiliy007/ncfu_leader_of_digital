exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (!con.userLib.checkAccess('org', req.session.auth)) {res.render('errorAccess');return;}
	
	let data = await con.promise().query('SELECT request.*, ncfu.logo as userLogo, ncfu.*, companies.logo as compLogo, companies.*, category.* FROM request ' +
		'LEFT JOIN ncfu using(studID) ' +
		'LEFT JOIN companies using(compID) ' +
		'LEFT JOIN category using(catID) ' +
		'WHERE statID = 4');
	data = data[0];

	let practice = [], groups = data.map(el => el.stGroup).filter((el, ind, arr) => arr.indexOf(el) === ind);

	if (data.length) {
		practice = await con.promise().query('SELECT * FROM date WHERE stGroup IN (?) AND beginDate > ?', [groups, new Date()]);
		practice = practice[0].filter((el, ind, arr) => arr.findIndex((els) => els.stGroup === el.stGroup) === ind);
	}

	res.render('complete', {userType: con.userLib.userType(req.session.auth), user: req.session, data, practice, groups});
};

exports.path = '/complete';