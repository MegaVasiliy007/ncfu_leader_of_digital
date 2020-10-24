exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (+req.params.id !== req.session.auth.studID && !con.userLib.checkAccess('comp', req.session.auth)) {res.render('errorAccess');return;}
	
	let data = await con.promise().query('SELECT department.name as depName, ncfu.*, naprav.name as napravName, social.* FROM ncfu ' +
		'LEFT JOIN department using(depID) ' +
		'LEFT JOIN naprav using(napravID) ' +
		'LEFT JOIN social using(socID) ' +
		'WHERE studID = ? AND role = 0', [req.params.id]);
	if (!data[0].length) {con.userLib.notFound(res); return;}
	data = data[0][0];
	
	let marks = await con.promise().query('SELECT marks.*, companies.* FROM marks LEFT JOIN companies using(compID) WHERE who = 0 AND studID = ?', [req.params.id]);
	marks = marks[0];

	let dates = await con.promise().query('SELECT * FROM date WHERE stGroup = (SELECT stGroup FROM ncfu WHERE studID = ?)', [req.params.id]);
	dates = dates[0];

	let request = await con.promise().query('SELECT COUNT(*) as count FROM request WHERE studID = ? AND compID = ? AND statID = 4', [req.params.id, req.session.auth.compID]);
	request = request[0][0].count;
	// console.log(request);

	let reqCat = await con.promise().query('SELECT * FROM category WHERE napravID = (SELECT napravID FROM ncfu WHERE studID = ?) AND catID IN (SELECT catID FROM countmembers WHERE compID = ?)', [req.params.id, req.session.auth.compID]);
	reqCat = reqCat[0];

	res.render('profile', {pageType: 'stud', userType: con.userLib.userType(req.session.auth), user: req.session, data, marks, dates, request, reqCat});
};

exports.path = '/student/:id([1-9][0-9]{0,})';