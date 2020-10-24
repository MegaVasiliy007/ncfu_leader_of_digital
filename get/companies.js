exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (!con.userLib.checkAccess('stud', req.session.auth)) {res.render('errorAccess');return;}
	
	let data = [], allData, sortData, cat = [];
	if (req.session.auth.studID) {
		data = await con.promise().query(
		'SELECT * FROM companies WHERE compID IN (' +
		'SELECT compID FROM countmembers WHERE catID IN (' +
		'SELECT catID FROM category WHERE napravID = (' +
		'SELECT napravID FROM ncfu WHERE studID = ?)))', [req.session.auth.studID]);
		cat = await con.promise().query(
			'SELECT * FROM countmembers WHERE catID IN (' +
			'SELECT catID FROM category WHERE napravID = (' +
			'SELECT napravID FROM ncfu WHERE studID = ?))', [req.session.auth.studID]);
		allData = await con.promise().query('SELECT * FROM companies WHERE information <> \'\'');
		sortData = await con.promise().query('SELECT * FROM category WHERE napravID = (SELECT napravID FROM ncfu WHERE studID = ?)', [req.session.auth.studID]);
		sortData = sortData[0];
	} else {
		allData = await con.promise().query('SELECT * FROM companies');
	}

	data = data[0];
	allData = allData[0];
	cat = cat[0];

	let names = await con.userLib.mysql.getCategories(allData.map(el => el.compID));

	res.render('companies', {userType: con.userLib.userType(req.session.auth), user: req.session, allData, data, names, sortData, cat});
};

exports.path = '/companies';