exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (!con.userLib.checkAccess('comp', req.session.auth)) {res.render('errorAccess');return;}

	let data, sortData = {};
	if (req.query.group && req.session.auth.orgID)
		data = await con.promise().query('SELECT * FROM ncfu LEFT JOIN naprav using(napravID) WHERE role = 0 AND stGroup = ?', [req.query.group]);
	else {
		data = await con.promise().query('SELECT * FROM ncfu LEFT JOIN naprav using(napravID) WHERE role = 0 '
			+ 'AND studID NOT IN (' +
					'SELECT studID FROM ncfu ' +
					'JOIN (SELECT studID, COUNT(*) as requestCount FROM request WHERE statID = 4 GROUP BY studID) as b using (studID) ' +
					'JOIN (SELECT stGroup, COUNT(*) as dateCount FROM date WHERE endDate < now() GROUP BY stGroup) as c using(stGroup) ' +
					'WHERE requestCount > dateCount)'
			+ 'AND napravID IN (SELECT napravID FROM category WHERE catID IN (SELECT catID FROM countmembers WHERE compID = ?))', [req.session.auth.compID]);
		if (data[0].length) {
			sortData.naprav = await con.promise().query('SELECT * FROM category ' +
				'WHERE napravID IN (?) AND catID IN (SELECT catID FROM countmembers WHERE compID = ?)', [
				data[0].map(el => el.napravID),
				req.session.auth.compID]);
			sortData.naprav = sortData.naprav[0];
			sortData.level = await con.promise().query('SELECT DISTINCT levelLearn FROM ncfu WHERE studID IN (?)', [data[0].map(el => el.studID)]);
			sortData.level = sortData.level[0];
			sortData.course = await con.promise().query('SELECT DISTINCT course FROM ncfu WHERE studID IN (?)', [data[0].map(el => el.studID)]);
			sortData.course = sortData.course[0];
		} else {
			sortData.naprav = [];
			sortData.level = [];
			sortData.course = [];
		}
	}

	data = data[0];

	// console.log(data);

	res.render('students', {userType: con.userLib.userType(req.session.auth), user: req.session, data, group: req.query.group || false, sortData});
};

exports.path = '/students';