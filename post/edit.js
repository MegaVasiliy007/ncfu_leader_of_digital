exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('back');return;}

	req.body.phone = req.body.phone.replace(/[^0-9]/g, '');
	if (req.body.phone[0] === '7')
		req.body.phone = req.body.phone.slice(1);

	req.body.phone = req.body.phone.slice(0, 10);

	if (con.userLib.userType(req.session.auth) === 'stud') {
		let socID = await con.promise().query('SELECT socID FROM ncfu WHERE studID = ?', [req.session.auth.studID]);
		socID = socID[0][0].socID;
		req.body.socID = socID;
		req.body.studID = req.session.auth.studID;
		
		con.upsert('social', req.body, (e, r) => {
			if (!req.body.socID) req.body.socID = r;
			con.update('ncfu', req.body, () => {
				res.redirect('/student/'+req.session.auth.studID);
			});
		});
	} else {

		//TODO validation.net проверка полей на заполненость

		req.body.compID = req.query.comp || req.session.auth.compID;

		let socID = await con.promise().query('SELECT socID FROM companies WHERE compID = ?', [req.body.compID]);
		socID = socID[0][0].socID;
		req.body.socID = socID;

		con.upsert('social', req.body, (e, r) => {
			if (!req.body.socID) req.body.socID = r;
			con.update('companies', req.body, () => {
				res.redirect('/company/'+req.body.compID);
			});
		});
	}
};

exports.path = '/edit';