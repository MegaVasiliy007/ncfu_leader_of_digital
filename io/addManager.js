exports.func = async (con, socket, data) => {
	if (!socket.request.session.auth) {return;}
	if (!data || data && (!data.id || !data.catID || !data.type)) return;

	data.phone = data.phone.replace(/[^0-9]/g, '');

	if (data.type === 'query')
		con.query('UPDATE request SET statID = 4 WHERE studID = ? AND compID = ? AND who = 1 AND catID = ?', [data.id, socket.request.session.auth.compID, data.catID], err => console.log(err));
	else
		con.query('UPDATE request SET statID = 4 WHERE studID = ? AND compID = ? AND who = 0 AND catID = ?', [data.id, socket.request.session.auth.compID, data.catID], err => console.log(err));

	socket.emit('sendAnswer');
};