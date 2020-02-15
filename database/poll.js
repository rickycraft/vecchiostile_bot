const db = require('./database');

const insert = (id, question) =>
	db.insert({
		poll_id: id,
		question: question,
		date: new Date(),
	});

const latest = async () => {
	const polls = await db
		.find({ poll_id: { $exists: true }, options: { $exists: false } })
		.sort({ date: -1 })
		.limit(1);
	if (polls.length > 0) return polls[0];
	else return null;
};
const removeLatest = async () => {
	const poll = await latest();
	if (poll) return db.remove({ poll });
	else return 0;
};

const update = (id, options) =>
	db.update({ _id: id }, { $set: { options: options } });

const removeAll = () =>
	db.remove(
		{ poll_id: { $exists: true }, options: { $exists: true } },
		{ multi: true }
	);

module.exports = {
	insert: insert,
	latest: latest,
	removeLatest: removeLatest,
	update: update,
	removeAll: removeAll,
};
