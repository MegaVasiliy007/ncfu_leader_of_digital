exports.func = async (con, req, res) => {
	// res.send('Index <a href="/login">Login</a><script src="/socket.io/socket.io.js"></script><script>var socket = io();</script>');

	let marksComp = await con.promise().query('SELECT *, ncfu.logo as studLogo FROM marks LEFT JOIN ncfu using(studID) LEFT JOIN companies using(compID) WHERE who = 1 AND mark > 3 LIMIT 6');
	marksComp = marksComp[0];
	let marksStud = await con.promise().query('SELECT *, companies.logo as compLogo FROM marks LEFT JOIN companies using(compID) LEFT JOIN ncfu using(studID) WHERE who = 0 AND mark > 3 LIMIT 6');
	marksStud = marksStud[0];

	let counts = {};
	counts.request = await con.promise().query('SELECT COUNT(distinct studID) as count FROM request WHERE statID = 4');
	counts.request = counts.request[0][0].count;

	counts.companies = await con.promise().query('SELECT COUNT(*) as count FROM companies');
	counts.companies = counts.companies[0][0].count;

	counts.marks = await con.promise().query('SELECT COUNT(*) as count FROM marks');
	counts.marks = counts.marks[0][0].count;

	// console.log(counts);

	res.render('index', {userType: con.userLib.userType(req.session.auth), user: req.session, marksComp, marksStud, counts});
};

exports.path = '/';