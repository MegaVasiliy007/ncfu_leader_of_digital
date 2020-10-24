exports.func = async (con, req, res) => {
	if (!req.session.auth) {
		res.redirect('/login');
		return;
	}
	if (con.userLib.checkAccess('org', req.session.auth)) {
		res.render('errorAccess');
		return;
	}

	//Костыль для автоматической отклоения заявок
	await con.promise().query('UPDATE request SET statID = 2 WHERE statID = 1 AND studID IN' +
		'(SELECT studID FROM ncfu ' +
		'JOIN (SELECT studID, COUNT(*) as requestCount FROM request WHERE statID = 3 OR statID = 4 GROUP BY studID) as b using (studID) ' +
		'JOIN (SELECT stGroup, COUNT(*) as dateCount FROM date GROUP BY stGroup) as c using(stGroup) ' +
		'WHERE requestCount >= dateCount)');
	//////////////////////////////////////////////

	let data, dates = [], sortData = [];
	if (req.session.auth.studID) {
		data = await con.promise().query('SELECT * FROM request LEFT JOIN companies using(compID) LEFT JOIN category using(catID) WHERE who = 0 AND studID = ?', [req.session.auth.studID]);
		if (data[0].length) {
			sortData = await con.promise().query('SELECT * FROM category WHERE catID IN (?)', [data[0].map(el => el.catID).filter((el, ind, arr) => arr.indexOf(el) === ind)]);
			sortData = sortData[0];
		}
	} else {
		data = await con.promise().query('SELECT * FROM request LEFT JOIN ncfu using(studID) LEFT JOIN category using(catID) WHERE who = 1 AND compID = ?', [req.session.auth.compID]);
		if (data[0].length) {
			dates = await con.promise().query('SELECT * FROM date WHERE beginDate > now() AND stGroup IN (?)', [data[0].map(el => el.stGroup).filter((el, ind, arr) => arr.indexOf(el) === ind)]);
			dates = dates[0];
		}
	}

	data = data[0];

	res.render('query', {userType: con.userLib.userType(req.session.auth), user: req.session, data, dates, sortData});
};

//Выборка для страницы предложений

exports.path = '/queue';