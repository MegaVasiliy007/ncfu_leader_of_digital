exports.func = async (con, socket, id, catID) => {
	if (!socket.request.session.auth) {return;}
	if (!id || !catID) return;

	if (con.userLib.userType(socket.request.session.auth) === 'stud') {
		con.query('INSERT INTO request (studID, compID, who, catID) VALUES (?, ?, 1, ?)', [socket.request.session.auth.studID, id, catID], (err) => {console.log(err);});
	} else {
		con.query('INSERT INTO request (studID, compID, who, catID) VALUES (?, ?, 0, ?)', [id, socket.request.session.auth.compID, catID], (err) => {console.log(err);});
	}

	socket.emit('sendAnswer');
};