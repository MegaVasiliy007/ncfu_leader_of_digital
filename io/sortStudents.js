exports.func = async (con, socket, naprav, level, course) => {
	if (!socket.request.session.auth) {return;}
	if (!con.userLib.checkAccess('comp', socket.request.session.auth)) {return;}

	let params = [];
	if (level.length) params.push(level);
	if (course.length) params.push(course);
	if (naprav.length) params.push(naprav);
	params.push(socket.request.session.auth.compID);

	let data = await con.promise().query(`SELECT * FROM ncfu LEFT JOIN naprav using(napravID)
		WHERE role = 0 ${level.length ? 'AND levelLearn IN (?)' : ''} ${course.length ? 'AND course IN (?)' : ''}
		AND studID NOT IN (
			SELECT studID FROM ncfu
			JOIN (SELECT studID, COUNT(*) as requestCount FROM request WHERE statID = 4 GROUP BY studID) as b using (studID)
			JOIN (SELECT stGroup, COUNT(*) as dateCount FROM date WHERE endDate < now() GROUP BY stGroup) as c using(stGroup)
			WHERE requestCount > dateCount)
		AND napravID IN (SELECT napravID FROM category WHERE catID IN (SELECT catID FROM countmembers WHERE ${naprav.length ? 'catID IN (?) AND' : ''} compID = ?))`, params);
	data = data[0];

	socket.emit('sendStudents', data);
};