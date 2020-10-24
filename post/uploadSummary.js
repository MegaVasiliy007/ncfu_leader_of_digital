const multer = require('multer');

const fileFilter = (req, file, cb) => {
	file.extention = file.originalname.split('.').last();
	if(file.extention === "pdf") cb(null, true);
	else cb(null, false);
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {cb(null, './public/resume/');},
	filename: (req, file, cb) => {cb(null, req.session.auth.studID + '.pdf');}
});

const uploader = multer({ storage : storage, fileFilter: fileFilter, limits: {fileSize: 3145728}}).single('resume');

exports.func = async (con, req, res) => {
	if (!req.session.auth) {res.redirect('/login');return;}
	if (!con.userLib.checkAccess('stud', req.session.auth)) {res.render('errorAccess');return;}

	uploader(req, res, (err) => {
		if (err && err.code === 'LIMIT_FILE_SIZE') return res.send(`Error summary size too big. Max size 3Mb. <a href='/student/${req.session.auth.studID}'>Назад</a>`);
		if (err) {console.warn(err);return res.send(`Error uploading file. Try later. <a href='/student/${req.session.auth.studID}'>Назад</a>`);}
		if (!req.file) return res.send(`Хак! <a href='/student/${req.session.auth.studID}'>Назад</a>`);

		con.update('ncfu', {studID: req.session.auth.studID, summary: 1}, () => {});
		res.redirect(`/student/${req.session.auth.studID}`);
	});
};

exports.path = '/uploadResume';