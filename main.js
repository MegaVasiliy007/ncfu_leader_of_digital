if (!Array.prototype.last) Array.prototype.last = function() {return this[this.length - 1]};

let session = require('express-session');

const express = require('express')
	, { readdir, readdirSync } = require('fs')
	, app = express()
	, http = require('http').Server(app)
	, MySQLStore = require('express-mysql-session')(session)
	, io = require('socket.io').listen(http)
	, func = require('./fuctions')
	, mysqlQueryModule = require('./mysql')
;

let con = require('mysql2').createConnection({user: 'jobs', password: 'jobs', database: 'jobs', charset: "utf8mb4"});
con.on('error', (err) => {console.warn(err)});
con.connect((err) => {if (err) return console.error('error connecting: ' + err.stack); console.log('mysql2 as id ' + con.threadId);});
con.query('SET SESSION wait_timeout = 604800');
let util = require('mysql-utilities');
util.upgrade(con);
util.introspection(con);

con.userLib = new func();
con.userLib.mysql = new mysqlQueryModule(con);

app.set("view engine", "ejs");
app.use(express.static('public'));

session = session({secret: "8g35jr9jg", store: new MySQLStore({expiration: 604800000}, con.promise()), resave: false, saveUninitialized: false, name: 'sid', cookie: {maxAge: 604800000}});

io.use((socket, next) => {session(socket.request, socket.request.res || {}, next)});
io.on('connection', (socket) => {
	readdir('./io/', (err, files) => {
		files.filter(el => el.endsWith('.js')).forEach(file => {
			try {
				const ioFile = require(`./io/${file}`);
				socket.on(file.slice(0, -3), ioFile.func.bind(null, con, socket));
				delete require.cache[require.resolve(`./io/${file}`)];
			} catch (e) {console.warn(e)}
		});
	});
});

app.use((req, res, next) => {
	if (con.userLib.checkAgent(req.headers['user-agent'])) {res.render('errorBrowser'); return;}
	next();
});

app.use(express.urlencoded({ extended: true })).use(express.json()).use(require('cookie-parser')()).use(session);

readdirSync("./get/").filter(el => el.endsWith('.js')).forEach(file => {
	try{
		const get = require(`./get/${file}`);
		app.get(get.path, get.func.bind(null, con));
		delete require.cache[require.resolve(`./get/${file}`)];
	} catch (e) {console.warn(e)}
});

readdirSync("./post/").filter(el => el.endsWith('.js')).forEach(file => {
	try {
		const post = require(`./post/${file}`);
		app.post(post.path, post.func.bind(null, con));
		delete require.cache[require.resolve(`./post/${file}`)];
	} catch (e) {console.warn(e)}
});

// Handle 404 AND 500
app.use((req, res) => con.userLib.notFound(res))
	.use((error, req, res) => {console.warn(error); res.status(500).send('500 Error <a href="/">Home page</a>');});

http.listen(8000, () => console.log('Work on port :8000'));
