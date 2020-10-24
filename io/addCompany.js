exports.func = async (con, socket, login, email) => {
	if (!socket.request.session.auth) {return;}
	if (!con.userLib.checkAccess('org', socket.request.session.auth)) {return;}
	if (!login || !email) return;

	let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		word = '';

	for(let i = 0; i < 24; i++)
		word += alphabet[Math.round(Math.random() * (alphabet.length - 1))];

	console.log(login, word);
	word = con.userLib.md5(word+con.userLib.passHash);

	con.insert('companies', {login, email, password: word}, (e) => console.log(e));

	socket.emit('sendAnswer');
};