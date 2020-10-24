exports.func = async (con, socket, id, mark, text) => {
	if (!socket.request.session.auth) {return;}
	if (!id || !mark || mark === 0 || !text) return;

	if (con.userLib.userType(socket.request.session.auth) === 'stud') {
		con.query('INSERT INTO marks (studID, compID, who, mark, text) VALUES (?, ?, 1, ?, ?) ON DUPLICATE KEY UPDATE mark = ?, text = ?', [socket.request.session.auth.studID, id, mark, text, mark, text]);
	} else {
		con.query('INSERT INTO marks (studID, compID, who, mark, text) VALUES (?, ?, 0, ?, ?) ON DUPLICATE KEY UPDATE mark = ?, text = ?', [id, socket.request.session.auth.compID, mark, text, mark, text]);
	}

	socket.emit('sendAnswer');
};