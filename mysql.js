module.exports = function (con) {
	this.getCategories = async (compID = []) => {
		if (!compID.length) return [];

		let names = await con.promise().query('SELECT compID, catID, name, count FROM category LEFT JOIN countmembers using(catID) WHERE compID IN (?)', [compID]);
		names = names[0];
		let category = {};
		for (let name of names) {if (!category[name.compID]) category[name.compID] = [];category[name.compID].push({name: name.name, catID: name.catID, count: name.count});}
		return category;
	};
};