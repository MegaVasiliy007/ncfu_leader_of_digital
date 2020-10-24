exports.func = async (con, req, res) => {
    res.render('about', {userType: con.userLib.userType(req.session.auth), user: req.session});
};

exports.path = '/about';