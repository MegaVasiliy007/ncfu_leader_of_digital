const multer = require('multer');

const fileFilter = (req, file, cb) => {
	file.extention = file.originalname.split('.').last();
	if(file.extention === "png" || file.extention === "jpg") cb(null, true);
	else cb(null, false);
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (req.params.type === 'student') cb(null, './public/image/students');
		else cb(null, './public/image/companies');
	},
	filename: (req, file, cb) => {
		if (req.params.type === 'student') cb(null, req.session.auth.studID + '.jpg');
		else cb(null, req.session.auth.compID + '.jpg');
	}
});

const uploader = multer({ storage, fileFilter, limits: {fileSize: 1048576}}).single('avatar');

exports.func = async (con, req, res) => {
	if (req.params.type !== 'student' && req.params.type !== 'company') {res.redirect('/'); return;}
	if (!req.session.auth) {res.redirect('/login');return;}

	uploader(req, res, (err) => {
		if (err && err.code === 'LIMIT_FILE_SIZE') return res.send(`Error avatar size too big. Max size 1Mb. <a href='/${req.params.type}/${(req.session.auth.studID || req.session.auth.compID)}'>Назад</a>`);
		if (err) {console.warn(err);return res.send(`Error uploading file. Try later. <a href='/${req.params.type}/${(req.session.auth.studID || req.session.auth.compID)}'>Назад</a>`);}
		if (!req.file) return res.send(`Хак! <a href='/${req.params.type}/${(req.session.auth.studID || req.session.auth.compID)}'>Назад</a>`);

		if (req.params.type === 'student') con.update('ncfu', {studID: req.session.auth.studID, logo: 1}, () => {});
		else con.update('companies', {compID: req.session.auth.compID, logo: 1}, () => {});

		res.redirect(`/${req.params.type}/${(req.session.auth.studID || req.session.auth.compID)}`);
	});
};

exports.path = '/upload/:type';