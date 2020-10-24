exports.func = async (con, req, res) => {
	if (!req.body.login || !req.body.password) {res.render('login', {err: 1, userType: con.userLib.userType(req.session.auth), data: req.body});return;}

	if (req.body.login === 'company') {

		let conf = await con.promise().query('SELECT compID, name, logo FROM companies WHERE login = ? AND password = ?', [
			req.body.login,
			con.userLib.md5(req.body.password + con.userLib.passHash)]);
		if (!conf[0].length) {
			res.render('login', {err: 1, userType: con.userLib.userType(req.session.auth), data: req.body});
			return;
		}

		req.session.auth = {};
		req.session.auth.compID = conf[0][0].compID;
		req.session.name = conf[0][0].name;
		req.session.logo = conf[0][0].logo;
		res.redirect('/company/' + conf[0][0].compID);
	} else {
		let userFromBase = await con.promise().query('SELECT studID, role, logo, fio FROM ncfu WHERE login = ?', [req.body.login]);
		userFromBase = userFromBase[0][0];
		if (!userFromBase) {res.render('login', {err: 1, userType: con.userLib.userType(req.session.auth), data: req.body});return;}
		console.log(userFromBase);

		req.session.auth = {};
		req.session.name = userFromBase.fio;
		req.session.logo = userFromBase.logo;

		if (userFromBase.role)  {
			req.session.auth.orgID = userFromBase.studID;
			res.redirect('/complete');
		} else {
			req.session.auth.studID = userFromBase.studID;
			res.redirect('/student/'+userFromBase.studID);
		}
	}
};

exports.path = '/login';
