const useragent = require('useragent');
useragent(true);

module.exports = function () {
	this.passHash = 'r9uhg9uer';
	
	this.md5 = require('js-md5');
	
	this.notFound = (res) => {
		res.status(404).send('404 Error <a href="/">Home page</a>');
	};
	
	/**
	 * @function
	 * @param {string} type
	 * @param {Object} auth
	 * @param {number} [auth.compID]
	 * @param {number} [auth.studID]
	 * @param {number} [auth.orgID]
	 * @returns {number}
	 */
	this.checkAccess = (type, auth = {compID: 0, studID: 0, orgID: 0}) => {
		if (auth.orgID) return 1;
		if (type === 'stud' && auth.studID) return 1;
		if (type === 'comp' && auth.compID) return 1;
		return 0;
	};

	this.checkAgent = (agent) => {
		agent = useragent.parse(agent);
		// console.log(agent);

		if (agent.family === 'IE') return true;

		if (agent.family === 'Edge' && +agent.major < 16) return true;

		if (agent.family === 'Chrome' && +agent.major < 57) return true;

		if (agent.family === 'Opera' && +agent.major < 44) return true;

		if (agent.family === 'Firefox' && +agent.major < 52) return true;

		if (agent.family === 'Safari') {
			if (+agent.major < 10) return true;
			if (+agent.major === 10 && +agent.minor < 1) return true;
		}

		if (agent.family === 'Mobile Safari') {
			if (+agent.major < 10) return true;
			if (+agent.major === 10 && +agent.minor < 3) return true;
		}

		if (agent.family === 'Samsung Internet') {
			if (+agent.major < 6) return true;
			if (+agent.major === 6 && +agent.minor < 2) return true;
		}

		return false;
	};

	/**
	 * @function
	 * @param {number} [auth.compID]
	 * @param {number} [auth.studID]
	 * @param {number} [auth.orgID]
	 * @returns {string}
	 */
	this.userType = (auth = {compID: 0, studID: 0, orgID: 0}) => {
		if (auth.orgID) return 'org';
		if (auth.studID) return 'stud';
		if (auth.compID) return 'comp';
		return 'none';
	};

	this.generateGroup = (stGroup, grade, formLearn, levelLearn) => {

		let temp = '';

		switch (levelLearn) {
			case 'Прикладной бакалавр':
			case 'Академический бакалавр':
			case 'Бакалавр':
				temp += 'б';
				break;
			case 'Специалист':
				temp += 'с';
				break;
			case 'Магистр':
				temp += 'м';
				break;
			case 'Аспирант':
				temp += 'а';
				break;
		}

		switch (formLearn) {
			case 'Очная':
				temp += 'о';
				break;
			case 'Заочная':
				temp += 'з';
				break;
			case 'Очно-заочная':
				temp += 'в';
				break;
		}

		return 'КТ'+temp+grade+'-'+stGroup;
	}

};