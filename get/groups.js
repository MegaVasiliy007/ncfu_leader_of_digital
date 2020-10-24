exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (!con.userLib.checkAccess('org', req.session.auth)) {res.render('errorAccess');return;}
	
	let data = await con.promise().query('SELECT DISTINCT stGroup, formLearn, levelLearn, name, course FROM ncfu LEFT JOIN department using(depID) ORDER BY levelLearn, course, stGroup');
	data = data[0];

	res.render('groups', {userType: con.userLib.userType(req.session.auth), user: req.session, data});
};

exports.path = '/groups';