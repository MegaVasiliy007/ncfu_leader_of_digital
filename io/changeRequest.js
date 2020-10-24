exports.func = async (con, socket, type = false, id, catID) => {
	if (!socket.request.session.auth) {return;}
	if (!id || !catID) return;

	if (con.userLib.userType(socket.request.session.auth) === 'stud')
		con.query('UPDATE request SET statID = ? WHERE studID = ? AND compID = ? AND who = 0 AND catID = ?', [type ? 3 : 2, socket.request.session.auth.studID, id, catID]);
	else
		con.query('UPDATE request SET statID = ? WHERE studID = ? AND compID = ? AND who = 1 AND catID = ?', [type ? 3 : 2, id, socket.request.session.auth.compID, catID]);

	socket.emit('sendAnswer');
};