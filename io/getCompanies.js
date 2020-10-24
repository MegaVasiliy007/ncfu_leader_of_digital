exports.func = async (con, socket, catID = []) => {
	if (!socket.request.session.auth) {return;}
	if (!con.userLib.checkAccess('stud', socket.request.session.auth)) {return;}

	let data;

	if (catID.length)
		data = await con.promise().query(
			'SELECT * FROM companies WHERE compID IN (' +
			'SELECT compID FROM countmembers WHERE catID IN (' +
			'SELECT catID FROM category WHERE catID IN (?) AND napravID = (' +
			'SELECT napravID FROM ncfu WHERE studID = ?)))', [catID, socket.request.session.auth.studID]);
	else
		data = await con.promise().query(
			'SELECT * FROM companies WHERE compID IN (' +
			'SELECT compID FROM countmembers WHERE catID IN (' +
			'SELECT catID FROM category WHERE napravID = (' +
			'SELECT napravID FROM ncfu WHERE studID = ?)))', [socket.request.session.auth.studID]);

	let cat = await con.promise().query(
		'SELECT * FROM countmembers WHERE catID IN (' +
		'SELECT catID FROM category WHERE napravID = (' +
		'SELECT napravID FROM ncfu WHERE studID = ?))', [socket.request.session.auth.studID]);

	data = data[0];
	cat = cat[0];
	console.log(data);

	let names = await con.userLib.mysql.getCategories(data.map(el => el.compID));

	socket.emit('sendCompanies', data, names, cat);
};