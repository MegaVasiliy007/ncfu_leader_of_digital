exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (+req.params.id !== req.session.auth.compID && !con.userLib.checkAccess('stud', req.session.auth)) {res.render('errorAccess');return;}
	
	let data = await con.promise().query('SELECT * FROM companies LEFT JOIN social using(socID) WHERE compID = ?', [req.params.id]);
	if (!data[0].length) {con.userLib.notFound(res); return;}
	data = data[0][0];
	
	let marks = await con.promise().query('SELECT * FROM marks LEFT JOIN ncfu using(studID) WHERE who = 1 AND compID = ?', [req.params.id]);
	marks = marks[0];

	let names = await con.promise().query(
		'SELECT * FROM countmembers WHERE compID = ? AND catID IN (' +
		'SELECT catID FROM category WHERE napravID = (' +
		'SELECT napravID FROM ncfu WHERE studID = ?))', [req.params.id, req.session.auth.studID]);
	data.names = names[0];

	let countRequest = await con.promise().query('SELECT COUNT(*) as count, catID FROM request WHERE compID = ? AND statID != 2 GROUP BY catID', [req.params.id]);
	countRequest = countRequest[0];

	let allCategory = await con.promise().query('SELECT * FROM category');
	allCategory = allCategory[0];

	let request = await con.promise().query('SELECT COUNT(*) as count FROM request WHERE compID = ? AND studID = ? AND statID = 4', [req.params.id, req.session.auth.studID]);
	request = request[0][0].count;

	let count = await con.promise().query('SELECT * FROM countmembers LEFT JOIN category using(catID) WHERE compID = ?', [req.params.id]);
	count = count[0];

	res.render('profile', {pageType: 'comp', userType: con.userLib.userType(req.session.auth), user: req.session, data, marks, allCategory, request, count, countRequest});
};

exports.path = '/company/:id([1-9][0-9]{0,})';