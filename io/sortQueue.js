exports.func = async (con, socket, catID = []) => {
	if (!socket.request.session.auth) {return;}
	if (!con.userLib.checkAccess('stud', socket.request.session.auth)) {return;}

	let data;

	if (catID.length)
		data = await con.promise().query(
			'SELECT * FROM request ' +
			'LEFT JOIN companies using(compID) ' +
			'LEFT JOIN category using(catID) ' +
			'WHERE catID IN (?) AND who = 0 AND studID = ?', [catID, socket.request.session.auth.studID]);
	else
		data = await con.promise().query(
			'SELECT * FROM request ' +
			'LEFT JOIN companies using(compID) ' +
			'LEFT JOIN category using(catID) ' +
			'WHERE who = 0 AND studID = ?', [socket.request.session.auth.studID]);

	data = data[0];

	let names = await con.userLib.mysql.getCategories(data.map(el => el.compID));

	socket.emit('sendQueue', data, names);
};