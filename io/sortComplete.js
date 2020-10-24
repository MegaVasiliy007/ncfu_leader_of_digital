exports.func = async (con, socket, groups = []) => {
	if (!socket.request.session.auth) {return;}
	if (!con.userLib.checkAccess('org', socket.request.session.auth)) {return;}

	let data;
	if (groups.length) {
		data = await con.promise().query('SELECT request.*, ncfu.logo as userLogo, ncfu.*, companies.logo as compLogo, companies.*, category.* FROM request ' +
			'LEFT JOIN ncfu using(studID) ' +
			'LEFT JOIN companies using(compID) ' +
			'LEFT JOIN category using(catID) ' +
			'WHERE statID = 4 AND stGroup IN (?)', [groups]);
	} else {
		data = await con.promise().query('SELECT request.*, ncfu.logo as userLogo, ncfu.*, companies.logo as compLogo, companies.*, category.* FROM request ' +
			'LEFT JOIN ncfu using(studID) ' +
			'LEFT JOIN companies using(compID) ' +
			'LEFT JOIN category using(catID) ' +
			'WHERE statID = 4');
	}
	data = data[0];


	let practice = [];
	if (data.length) {
		if (groups.length) {
			practice = await con.promise().query('SELECT * FROM date WHERE stGroup IN (?) AND beginDate > ?', [groups, new Date()]);
			practice = practice[0].filter((el, ind, arr) => arr.findIndex((els) => els.stGroup === el.stGroup) === ind);
		} else {
			practice = await con.promise().query('SELECT * FROM date WHERE stGroup IN (?) AND beginDate > ?', [
				data.map(el => el.stGroup).filter((el, ind, arr) => arr.indexOf(el) === ind),
				new Date()
			]);
			practice = practice[0].filter((el, ind, arr) => arr.findIndex((els) => els.stGroup === el.stGroup) === ind);
		}
	}

	socket.emit('sendComplete', data, practice);
};